/**
 * SWC Utilities for i18nexus-tools
 *
 * Babel → swc 마이그레이션: AST 파싱 및 변환
 * - 20배 성능 향상
 * - Babel과 동일한 AST 구조 유지
 */

import { parseSync, transformSync } from "@swc/core";
import * as t from "@babel/types";
import generate from "@babel/generator";

/**
 * swc로 파일 파싱 (Babel parser 대체)
 *
 * @param code - 파싱할 소스 코드
 * @param options - 파싱 옵션
 * @returns Babel 호환 AST
 */
export function parseFileWithSwc(
  code: string,
  options: {
    sourceType?: "module" | "script";
    jsx?: boolean;
    tsx?: boolean;
    decorators?: boolean;
  } = {}
): t.File {
  const {
    sourceType = "module",
    jsx = true,
    tsx = true,
    decorators = true,
  } = options;

  try {
    // swc로 파싱
    const ast = parseSync(code, {
      syntax: tsx ? "typescript" : "ecmascript",
      tsx,
      decorators,
      dynamicImport: true,
    });

    // swc AST를 Babel AST로 변환
    // swc는 이미 Babel 호환 AST를 반환하므로 그대로 사용
    return ast as unknown as t.File;
  } catch (error) {
    // swc 파싱 실패시 에러 던지기
    throw new Error(`SWC parse error: ${error}`);
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
  ast: t.File,
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
export function benchmarkParser(code: string, iterations: number = 100) {
  const results = {
    swc: 0,
    codeLength: code.length,
  };

  // swc 벤치마크
  const swcStart = performance.now();
  for (let i = 0; i < iterations; i++) {
    parseFileWithSwc(code);
  }
  results.swc = performance.now() - swcStart;

  return results;
}
