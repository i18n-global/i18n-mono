/**
 * AST 파서 유틸리티
 * extractor와 wrapper에서 공통으로 사용
 */

import { parse as babelParse } from "@babel/parser";
import generate from "@babel/generator";
import * as t from "@babel/types";

export interface ParseOptions {
  sourceType?: "module" | "script";
  jsx?: boolean;
  tsx?: boolean;
  decorators?: boolean;
}

export interface GenerateOptions {
  retainLines?: boolean;
  comments?: boolean;
}

/**
 * Babel 파서 기본 플러그인 목록
 */
export const BABEL_BASE_PLUGINS = [
  "typescript",
  "jsx",
  "decorators-legacy",
  "classProperties",
  "objectRestSpread",
] as const;

/**
 * Babel 파서 확장 플러그인 목록 (extractor용)
 */
export const BABEL_EXTENDED_PLUGINS = [
  ...BABEL_BASE_PLUGINS,
  "asyncGenerators",
  "functionBind",
  "exportDefaultFrom",
  "exportNamespaceFrom",
  "dynamicImport",
] as const;

/**
 * Babel 파서로 코드 파싱
 */
export function parseWithBabel(
  code: string,
  options: ParseOptions & { extendedPlugins?: boolean } = {}
): t.File {
  const plugins = options.extendedPlugins
    ? [...BABEL_EXTENDED_PLUGINS]
    : [...BABEL_BASE_PLUGINS];

  return babelParse(code, {
    sourceType: options.sourceType || "module",
    plugins: plugins as any,
  });
}

/**
 * 코드 파싱 (Babel 사용)
 */
export function parseFile(code: string, options: ParseOptions = {}): t.File {
  return parseWithBabel(code, options);
}

/**
 * Babel로 AST를 코드로 생성
 */
export function generateWithBabel(
  ast: t.File,
  options: GenerateOptions = {}
): { code: string; map?: any } {
  return generate(ast, {
    retainLines: options.retainLines !== false,
    comments: options.comments !== false,
    // Enable TypeScript support for type parameters
    decoratorsBeforeExport: true,
  } as any);
}

/**
 * AST를 코드로 생성 (Babel 사용)
 */
export function generateCode(
  ast: t.File,
  options: GenerateOptions = {}
): { code: string; map?: any } {
  return generateWithBabel(ast, options);
}
