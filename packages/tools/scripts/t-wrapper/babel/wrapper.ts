import { glob } from "glob";
import { readFile } from "../common/utils/fs-utils";
import traverse, { NodePath } from "@babel/traverse";
import * as t from "@babel/types";
import {
  ScriptConfig,
  SCRIPT_CONFIG_DEFAULTS,
} from "../../common/default-config";
import { parseFile } from "../../common/ast/parser-utils";
import { tryTransformComponent } from "../common/ast/component-transformer";
import {
  applyTranslationsToAST,
  writeASTToFile,
} from "../common/applier/translation-applier";
import { updateExistingUseTranslation } from "../common/ast/namespace-updater";
import { inferNamespaceFromFile } from "../../extractor/namespace-inference";
import { loadConfig } from "../../config-loader";

export async function wrapTranslations(
  config: Partial<ScriptConfig> = {},
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
      const ast = parseFile(code, {
        sourceType: "module",
        tsx: true,
        decorators: true,
      });

      // i18nexus.config.json 로드 (네임스페이스 설정 확인)
      const i18nexusConfig = loadConfig("i18nexus.config.json", { silent: true });
      const namespacingEnabled = i18nexusConfig.namespacing?.enabled ?? false;

      // 네임스페이스 업데이트 시도
      let namespaceUpdated = false;
      if (namespacingEnabled && i18nexusConfig.namespacing) {
        const correctNamespace = inferNamespaceFromFile(
          filePath,
          code,
          i18nexusConfig.namespacing
        );
        if (correctNamespace) {
          namespaceUpdated = updateExistingUseTranslation(ast, correctNamespace, code);
        }
      }

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

      // 파일이 수정되었거나 네임스페이스가 업데이트된 경우
      if (isFileModified || namespaceUpdated) {
        if (isFileModified) {
          applyTranslationsToAST(
            ast,
            modifiedComponentPaths,
            fullConfig,
            filePath,
            code,
          );
        }
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
