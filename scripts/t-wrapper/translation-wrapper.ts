import * as path from "path";
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

export class TranslationWrapper {
  public readonly config: Required<ScriptConfig>;

  constructor(config: Partial<ScriptConfig> = {}) {
    this.config = {
      ...SCRIPT_CONFIG_DEFAULTS,
      ...config,
    } as Required<ScriptConfig>;
  }

  private processComponent(
    path: NodePath<t.Function>,
    code: string,
    modifiedComponentPaths: NodePath<t.Function>[]
  ): boolean {
    let componentName: string | null | undefined;
    if (path.isFunctionDeclaration() && path.node.id) {
      componentName = path.node.id.name;
    } else if (
      path.isArrowFunctionExpression() &&
      t.isVariableDeclarator(path.parent) &&
      t.isIdentifier(path.parent.id)
    ) {
      componentName = path.parent.id.name;
    }

    if (
      componentName &&
      (isReactComponent(componentName) || isReactCustomHook(componentName))
    ) {
      const transformResult = transformFunctionBody(path, code);
      if (transformResult.wasModified) {
        modifiedComponentPaths.push(path);
        return true;
      }
    }
    return false;
  }

  private applyTranslationsToFile(
    ast: t.File,
    filePath: string,
    modifiedComponentPaths: NodePath<t.Function>[]
  ): void {
    const isServerMode = this.config.mode === "server";
    const isClientMode = this.config.mode === "client";
    const isNextjsFramework = this.config.framework === "nextjs";

    if (isNextjsFramework && isClientMode) {
      ensureUseClientDirective(ast);
    }

    const usedTranslationFunctions = new Set<string>();

    modifiedComponentPaths.forEach((componentPath) => {
      if (
        componentPath.scope.hasBinding(STRING_CONSTANTS.TRANSLATION_FUNCTION)
      ) {
        return;
      }

      const body = componentPath.get("body");

      const translationFunctionName = isServerMode
        ? this.config.serverTranslationFunction
        : STRING_CONSTANTS.USE_TRANSLATION;

      if (hasTranslationFunctionCall(body, translationFunctionName)) {
        return;
      }

      if (isServerMode) {
        (componentPath.node as any).async = true;
      }
      const decl = createTranslationBinding(
        isServerMode ? "server" : "client",
        isServerMode ? this.config.serverTranslationFunction : undefined
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
      ensureNamedImport(ast, this.config.translationImportSource, functionName);
    });

    const output = generateCode(ast, this.config.parserType, {
      retainLines: true,
      comments: true,
    });

    writeFile(filePath, output.code);
  }

  public async processFiles(): Promise<{
    processedFiles: string[];
  }> {
    const filePaths = await glob(this.config.sourcePattern);
    const processedFiles: string[] = [];

    for (const filePath of filePaths) {
      let isFileModified = false;
      const code = readFile(filePath);

      try {
        const ast = parseFile(code, this.config.parserType, {
          sourceType: "module",
          tsx: true,
          decorators: true,
        });

        const modifiedComponentPaths: NodePath<t.Function>[] = [];

        traverse(ast, {
          FunctionDeclaration: (path) => {
            if (this.processComponent(path, code, modifiedComponentPaths)) {
              isFileModified = true;
            }
          },
          ArrowFunctionExpression: (path) => {
            if (
              t.isVariableDeclarator(path.parent) &&
              t.isIdentifier(path.parent.id)
            ) {
              if (this.processComponent(path, code, modifiedComponentPaths)) {
                isFileModified = true;
              }
            }
          },
        });

        if (isFileModified) {
          this.applyTranslationsToFile(ast, filePath, modifiedComponentPaths);
          processedFiles.push(filePath);
        }
      } catch (error) {
        // 에러 발생 시 조용히 스킵
      }
    }

    return {
      processedFiles,
    };
  }
}
