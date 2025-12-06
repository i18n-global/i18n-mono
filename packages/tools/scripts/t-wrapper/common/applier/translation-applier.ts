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
 * 함수의 props에 t 함수가 있는지 확인
 */
function checkIfTIsInProps(fnNode: t.Function): boolean {
  const params = fnNode.params;
  if (params.length === 0) {
    return false;
  }

  const firstParam = params[0];

  // ObjectPattern: function MyComponent({ t, other }) {}
  if (t.isObjectPattern(firstParam)) {
    return firstParam.properties.some((prop) => {
      if (t.isObjectProperty(prop) && t.isIdentifier(prop.key)) {
        return prop.key.name === STRING_CONSTANTS.TRANSLATION_FUNCTION;
      }
      if (t.isRestElement(prop) && t.isIdentifier(prop.argument)) {
        return false; // rest는 제외
      }
      return false;
    });
  }

  // Identifier with TypeScript annotation: function MyComponent(props: Props) {}
  if (t.isIdentifier(firstParam)) {
    // 함수 body에서 const { t } = props 패턴 확인
    if (t.isBlockStatement(fnNode.body)) {
      const body = fnNode.body;

      for (const stmt of body.body) {
        if (t.isVariableDeclaration(stmt)) {
          // const { t } = props 패턴
          for (const decl of stmt.declarations) {
            if (
              t.isVariableDeclarator(decl) &&
              t.isObjectPattern(decl.id) &&
              t.isIdentifier(decl.init) &&
              decl.init.name === firstParam.name
            ) {
              const hasTInDestructure = decl.id.properties.some((prop) => {
                if (t.isObjectProperty(prop) && t.isIdentifier(prop.key)) {
                  return (
                    prop.key.name === STRING_CONSTANTS.TRANSLATION_FUNCTION
                  );
                }
                return false;
              });

              if (hasTInDestructure) {
                return true;
              }
            }
          }
        }
      }
    }
  }

  return false;
}

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

  // namespaceLocation이 있으면 자동으로 enabled로 간주
  const namespacingEnabled =
    i18nexusConfig.namespacing?.enabled ?? !!i18nexusConfig.namespaceLocation;

  // 네임스페이스 추론 (파일 전체에 대해)
  let correctNamespace: string | undefined;
  if (namespacingEnabled && filePath && sourceCode) {
    // namespacing 설정이 없으면 namespaceLocation으로부터 생성
    const namespacingConfig =
      i18nexusConfig.namespacing ||
      (i18nexusConfig.namespaceLocation
        ? {
            enabled: true,
            basePath: i18nexusConfig.namespaceLocation,
            defaultNamespace: i18nexusConfig.fallbackNamespace || "common",
            framework: i18nexusConfig.namespacing?.framework || "nextjs-app",
            strategy: i18nexusConfig.namespacing?.strategy || "first-folder",
          }
        : undefined);

    if (namespacingConfig) {
      correctNamespace = inferNamespaceFromFile(
        filePath,
        sourceCode,
        namespacingConfig,
      );
    }
  }

  // 1단계: 기존 useTranslation() 호출이 있으면 네임스페이스 추가/수정
  if (correctNamespace && sourceCode) {
    const updated = updateExistingUseTranslation(
      ast,
      correctNamespace,
      sourceCode,
    );
    if (updated) {
      // useTranslation이 이미 있고 업데이트되었으면 import만 확인
      ensureNamedImport(
        ast,
        config.translationImportSource,
        STRING_CONSTANTS.USE_TRANSLATION,
      );
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

    // t가 props로 내려오는지 확인
    const hasTAsProps = checkIfTIsInProps(componentPath.node);

    if (hasTAsProps) {
      // t가 props로 있으면 common 네임스페이스 사용
      namespace = i18nexusConfig.fallbackNamespace || "common";
    } else if (namespacingEnabled && filePath && sourceCode) {
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
    // 서버 모드일 때는 import source에 /server 추가
    const effectiveImportSource = isServerMode
      ? `${config.translationImportSource}/server`
      : config.translationImportSource;
    ensureNamedImport(ast, effectiveImportSource, functionName);
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

  // 제네릭 타입은 TypeScript가 인자로부터 자동 추론하므로 추가하지 않음
  // useTranslation("namespace") - 이 형태로 충분
  writeFile(filePath, output.code);
}
