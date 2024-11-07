/**
 * AST 파서 유틸리티
 * extractor와 wrapper에서 공통으로 사용
 */

import { parse as babelParse } from "@babel/parser";
import generate from "@babel/generator";
import * as t from "@babel/types";
import { parseFileWithSwc, generateCodeFromAst } from "../../swc-utils";

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
 * Babel 파서로 코드 파싱
 */
export function parseWithBabel(
  code: string,
  options: ParseOptions = {}
): t.File {
  return babelParse(code, {
    sourceType: options.sourceType || "module",
    plugins: [
      "typescript",
      "jsx",
      "decorators-legacy",
      "classProperties",
      "objectRestSpread",
    ],
  });
}

/**
 * SWC 파서로 코드 파싱
 */
export function parseWithSwc(
  code: string,
  options: ParseOptions = {}
): t.File {
  return parseFileWithSwc(code, {
    sourceType: options.sourceType || "module",
    tsx: options.tsx !== false,
    jsx: options.jsx !== false,
    decorators: options.decorators !== false,
  });
}

/**
 * 파서 타입에 따라 코드 파싱
 */
export function parseFile(
  code: string,
  parserType: "babel" | "swc" = "babel",
  options: ParseOptions = {}
): t.File {
  if (parserType === "babel") {
    return parseWithBabel(code, options);
  } else {
    return parseWithSwc(code, options);
  }
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
  });
}

/**
 * SWC로 AST를 코드로 생성
 */
export function generateWithSwc(
  ast: t.File,
  options: GenerateOptions = {}
): { code: string; map?: any } {
  return generateCodeFromAst(ast, {
    retainLines: options.retainLines !== false,
    comments: options.comments !== false,
  });
}

/**
 * 파서 타입에 따라 AST를 코드로 생성
 */
export function generateCode(
  ast: t.File,
  parserType: "babel" | "swc" = "babel",
  options: GenerateOptions = {}
): { code: string; map?: any } {
  if (parserType === "babel") {
    return generateWithBabel(ast, options);
  } else {
    return generateWithSwc(ast, options);
  }
}

