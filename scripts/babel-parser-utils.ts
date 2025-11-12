/**
 * Babel Parser Utilities for i18nexus-tools
 *
 * 기존 Babel 파서 사용 (성능 비교용)
 * - swc 버전과 성능 비교를 위해 유지
 */

import * as parser from "@babel/parser";
import * as t from "@babel/types";
import generate from "@babel/generator";

/**
 * Babel로 파일 파싱 (기존 방식)
 *
 * @param code - 파싱할 소스 코드
 * @param options - 파싱 옵션
 * @returns Babel AST
 */
export function parseFileWithBabel(
  code: string,
  options: {
    sourceType?: "module" | "script";
    jsx?: boolean;
    tsx?: boolean;
    decorators?: boolean;
  } = {}
): t.File {
  const { sourceType = "module", tsx = true, decorators = true } = options;

  try {
    // Babel로 파싱
    const ast = parser.parse(code, {
      sourceType,
      plugins: [
        "jsx",
        "typescript",
        ...(decorators
          ? [["decorators", { decoratorsBeforeExport: true }] as any]
          : []),
      ],
    });

    return ast;
  } catch (error) {
    throw new Error(`Babel parse error: ${error}`);
  }
}

/**
 * AST를 코드로 변환 (Babel generator 사용)
 *
 * @param ast - Babel AST
 * @param options - 생성 옵션
 * @returns 생성된 코드
 */
export function generateCodeFromAst(
  ast: t.File | t.Node,
  options: {
    retainLines?: boolean;
    compact?: boolean;
    comments?: boolean;
  } = {}
): { code: string; map?: any } {
  const { retainLines = true, compact = false, comments = true } = options;

  return generate(ast, {
    retainLines,
    compact,
    comments,
    jsescOption: {
      minimal: true,
    },
  });
}

/**
 * 성능 비교용 벤치마크 함수
 */
export function benchmarkBabelParser(code: string, iterations: number = 100) {
  const results = {
    babel: 0,
    codeLength: code.length,
  };

  // Babel 벤치마크
  const babelStart = performance.now();
  for (let i = 0; i < iterations; i++) {
    parseFileWithBabel(code);
  }
  results.babel = performance.now() - babelStart;

  return results;
}
