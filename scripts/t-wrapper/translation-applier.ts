import { NodePath } from "@babel/traverse";
import * as t from "@babel/types";
import { ScriptConfig } from "../common/default-config";
import { generateCode } from "../common/ast/parser-utils";
import {
  hasTranslationFunctionCall,
  createTranslationBinding,
} from "./ast-helpers";
import { ensureNamedImport, ensureUseClientDirective } from "./import-manager";
import { STRING_CONSTANTS } from "./constants";
import { writeFile } from "./fs-utils";

/**
 * AST에 번역 바인딩 및 import 추가
 * 파일 쓰기는 포함하지 않음 (테스트 용이성을 위해)
 */
export function applyTranslationsToAST(
  ast: t.File,
  modifiedComponentPaths: NodePath<t.Function>[],
  config: Required<ScriptConfig>
): void {
  const isServerMode = config.mode === "server";
  const isClientMode = config.mode === "client";
  const isNextjsFramework = config.framework === "nextjs";

  if (isNextjsFramework && isClientMode) {
    ensureUseClientDirective(ast);
  }

  const usedTranslationFunctions = new Set<string>();

  // 수정된것 중 t가 있는 것을 찾아서 수정
  modifiedComponentPaths.forEach((componentPath) => {
    if (componentPath.scope.hasBinding(STRING_CONSTANTS.TRANSLATION_FUNCTION)) {
      return;
    }

    const body = componentPath.get("body");

    const translationFunctionName = isServerMode
      ? config.serverTranslationFunction
      : STRING_CONSTANTS.USE_TRANSLATION;

    if (hasTranslationFunctionCall(body, translationFunctionName)) {
      return;
    }

    if (isServerMode) {
      (componentPath.node as any).async = true;
    }
    const decl = createTranslationBinding(
      isServerMode ? "server" : "client",
      isServerMode ? config.serverTranslationFunction : undefined
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
  config: Required<ScriptConfig>
): void {
  const output = generateCode(ast, config.parserType, {
    retainLines: true,
    comments: true,
  });

  writeFile(filePath, output.code);
}
