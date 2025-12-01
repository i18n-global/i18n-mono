import { NodePath } from "@babel/traverse";
import * as t from "@babel/types";
import { ScriptConfig } from "../../../common/default-config";
import { generateCode } from "../../../common/ast/parser-utils";
import {
  hasTranslationFunctionCall,
  createTranslationBinding,
  extractNamespaceFromUseTranslation,
} from "../ast/ast-helpers";
import {
  ensureNamedImport,
  ensureUseClientDirective,
} from "../manager/import-manager";
import { STRING_CONSTANTS } from "../utils/constants";
import { writeFile } from "../utils/fs-utils";
import { inferNamespaceFromFile } from "../../../extractor/namespace-inference";
import { loadConfig } from "../../../config-loader";
import { updateExistingUseTranslation } from "../ast/namespace-updater";

/**
 * AST에 번역 바인딩 및 import 추가
 * 파일 쓰기는 포함하지 않음 (테스트 용이성을 위해)
 * 
 * @param ast - Babel AST
 * @param modifiedComponentPaths - 수정된 컴포넌트 경로들
 * @param config - 스크립트 설정
 * @param filePath - 파일 경로 (네임스페이스 추론용)
 * @param sourceCode - 소스 코드 (네임스페이스 추론용)
 */
export function applyTranslationsToAST(
  ast: t.File,
  modifiedComponentPaths: NodePath<t.Function>[],
  config: Required<ScriptConfig>,
  filePath?: string,
  sourceCode?: string,
): void {
  const isServerMode = config.mode === "server";
  const isClientMode = config.mode === "client";
  const isNextjsFramework = config.framework === "nextjs";

  if (isNextjsFramework && isClientMode) {
    ensureUseClientDirective(ast);
  }

  const usedTranslationFunctions = new Set<string>();

  // i18nexus.config.json 로드 (네임스페이스 설정 확인)
  const i18nexusConfig = loadConfig("i18nexus.config.json", { silent: true });
  const namespacingEnabled = i18nexusConfig.namespacing?.enabled ?? false;

  // 네임스페이스 추론 (파일 전체에 대해)
  let correctNamespace: string | undefined;
  if (namespacingEnabled && filePath && sourceCode && i18nexusConfig.namespacing) {
    correctNamespace = inferNamespaceFromFile(
      filePath,
      sourceCode,
      i18nexusConfig.namespacing
    );
  }

  // 1단계: 기존 useTranslation() 호출이 있으면 네임스페이스 추가/수정
  if (correctNamespace && sourceCode) {
    const updated = updateExistingUseTranslation(ast, correctNamespace, sourceCode);
    if (updated) {
      // useTranslation이 이미 있고 업데이트되었으면 import만 확인
      ensureNamedImport(ast, config.translationImportSource, STRING_CONSTANTS.USE_TRANSLATION);
      return; // 이미 useTranslation이 있으므로 새로 추가하지 않음
    }
  }

  // 2단계: useTranslation()이 없는 경우에만 새로 추가
  const translationFunctionName = isServerMode
    ? config.serverTranslationFunction
    : STRING_CONSTANTS.USE_TRANSLATION;

  // 수정된것 중 t가 있는 것을 찾아서 수정
  modifiedComponentPaths.forEach((componentPath) => {
    if (componentPath.scope.hasBinding(STRING_CONSTANTS.TRANSLATION_FUNCTION)) {
      return;
    }

    const body = componentPath.get("body");

    if (hasTranslationFunctionCall(body, translationFunctionName)) {
      return;
    }

    if (isServerMode) {
      (componentPath.node as any).async = true;
    }

    // 네임스페이스 추론
    let namespace: string | undefined;
    
    if (namespacingEnabled && filePath && sourceCode) {
      // 1순위: 기존 useTranslation() 호출에서 네임스페이스 추출
      const existingNamespace = extractNamespaceFromUseTranslation(body);
      
      if (existingNamespace) {
        namespace = existingNamespace;
      } else {
        namespace = correctNamespace;
      }
    }

    const decl = createTranslationBinding(
      isServerMode ? "server" : "client",
      isServerMode ? config.serverTranslationFunction : undefined,
      namespace, // 네임스페이스 전달
    );

    // body 최상단에 추가
    if (body.isBlockStatement()) {
      body.unshiftContainer("body", decl);
    }
    // body 최상단이 아닌 경우 리턴 앞에 추가
    // 예시: const Home = () => <div />;
    else {
      const original = body.node as t.Expression;
      (componentPath.node as any).body = t.blockStatement([
        decl,
        t.returnStatement(original),
      ]);
    }

    // 사용된 번역 함수 추가
    usedTranslationFunctions.add(translationFunctionName);
  });

  // 사용된 번역 함수 가져와서 임포트 구문 추가
  usedTranslationFunctions.forEach((functionName) => {
    ensureNamedImport(ast, config.translationImportSource, functionName);
  });
}

/**
 * AST를 코드로 변환하여 파일에 쓰기
 */
export function writeASTToFile(
  ast: t.File,
  filePath: string,
  config: Required<ScriptConfig>,
): void {
  const output = generateCode(ast, {
    retainLines: true,
    comments: true,
  });

  // Post-process: Add TypeScript generics to useTranslation calls
  // @babel/generator doesn't preserve TypeScript type parameters, so we add them manually
  // Pattern: useTranslation("namespace") -> useTranslation<"namespace">("namespace")
  let code = output.code;
  
  // Add generics to all useTranslation calls
  code = code.replace(
    /useTranslation\(["']([^"']+)["']\)/g,
    (match, namespace) => {
      // Skip if already has generic
      const beforeMatch = code.substring(0, code.indexOf(match));
      if (beforeMatch.endsWith(`<"${namespace}">`)) {
        return match;
      }
      return `useTranslation<"${namespace}">("${namespace}")`;
    }
  );

  writeFile(filePath, code);
}
