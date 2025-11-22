import { glob } from "glob";
import { writeFile, readFile } from "./fs-utils";
import traverse, { NodePath } from "@babel/traverse";
import * as t from "@babel/types";
import { ScriptConfig, SCRIPT_CONFIG_DEFAULTS } from "../common/default-config";
import { parseFile, generateCode } from "../common/ast/parser-utils";
import {
  isReactComponent,
  isReactCustomHook,
  hasTranslationFunctionCall,
  createTranslationBinding,
} from "./ast-helpers";
import { ensureNamedImport, ensureUseClientDirective } from "./import-manager";
import { transformFunctionBody } from "./ast-transformers";
import { STRING_CONSTANTS } from "./constants";

function tryTransformComponent(
  path: NodePath<t.Function>,
  code: string,
  modifiedComponentPaths: NodePath<t.Function>[]
): boolean {
  let functionName: string | null | undefined;
  if (path.isFunctionDeclaration() && path.node.id) {
    functionName = path.node.id.name;
  } else if (
    path.isArrowFunctionExpression() &&
    t.isVariableDeclarator(path.parent) &&
    t.isIdentifier(path.parent.id)
  ) {
    functionName = path.parent.id.name;
  }

  if (
    functionName &&
    (isReactComponent(functionName) || isReactCustomHook(functionName))
  ) {
    const transformResult = transformFunctionBody(path, code);
    if (transformResult.wasModified) {
      modifiedComponentPaths.push(path);
      return true;
    }
  }
  return false;
}

function applyTranslationsToFile(
  ast: t.File,
  filePath: string,
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

    if (body.isBlockStatement()) {
      body.unshiftContainer("body", decl);
    } else {
      const original = body.node as t.Expression;
      (componentPath.node as any).body = t.blockStatement([
        decl,
        t.returnStatement(original),
      ]);
    }

    usedTranslationFunctions.add(translationFunctionName);
  });

  usedTranslationFunctions.forEach((functionName) => {
    ensureNamedImport(ast, config.translationImportSource, functionName);
  });

  const output = generateCode(ast, config.parserType, {
    retainLines: true,
    comments: true,
  });

  writeFile(filePath, output.code);
}

export async function processFiles(
  config: Partial<ScriptConfig> = {}
): Promise<{
  processedFiles: string[];
  totalTime: number;
}> {
  const fullConfig = {
    ...SCRIPT_CONFIG_DEFAULTS,
    ...config,
  } as Required<ScriptConfig>;

  const startTime = Date.now();
  const filePaths = await glob(fullConfig.sourcePattern);
  const processedFiles: string[] = [];

  for (const filePath of filePaths) {
    let isFileModified = false;
    const code = readFile(filePath);

    try {
      const ast = parseFile(code, fullConfig.parserType, {
        sourceType: "module",
        tsx: true,
        decorators: true,
      });

      const modifiedComponentPaths: NodePath<t.Function>[] = [];

      traverse(ast, {
        FunctionDeclaration: (path) => {
          if (tryTransformComponent(path, code, modifiedComponentPaths)) {
            isFileModified = true;
          }
        },
        ArrowFunctionExpression: (path) => {
          if (
            t.isVariableDeclarator(path.parent) &&
            t.isIdentifier(path.parent.id)
          ) {
            if (tryTransformComponent(path, code, modifiedComponentPaths)) {
              isFileModified = true;
            }
          }
        },
      });

      if (isFileModified) {
        applyTranslationsToFile(
          ast,
          filePath,
          modifiedComponentPaths,
          fullConfig
        );
        processedFiles.push(filePath);
      }
    } catch (error) {
      // 에러 발생 시 조용히 스킵
    }
  }

  const totalTime = Date.now() - startTime;

  return {
    processedFiles,
    totalTime,
  };
}
