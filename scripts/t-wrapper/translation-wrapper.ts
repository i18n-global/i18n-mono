import { glob } from "glob";
import { readFile } from "./utils/fs-utils";
import traverse, { NodePath } from "@babel/traverse";
import * as t from "@babel/types";
import { ScriptConfig, SCRIPT_CONFIG_DEFAULTS } from "../common/default-config";
import { parseFile } from "../common/ast/parser-utils";
import { tryTransformComponent } from "./ast/component-transformer";
import { applyTranslationsToAST, writeASTToFile } from "./applier/translation-applier";

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
        applyTranslationsToAST(ast, modifiedComponentPaths, fullConfig);
        writeASTToFile(ast, filePath, fullConfig);
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
