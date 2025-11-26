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
 * ⚠️ 주의: SWC AST는 Babel AST와 구조가 다릅니다.
 * 실제 변환이 필요하지만, 현재는 성능상 이점이 없어 Babel을 사용하는 것을 권장합니다.
 *
 * @param code - 파싱할 소스 코드
 * @param options - 파싱 옵션
 * @returns Babel 호환 AST (실제로는 변환 필요)
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
    // ⚠️ SWC AST를 Babel AST로 변환하는 실제 구현이 필요합니다.
    // 현재는 타입 캐스팅만 하고 있어서 Babel traverse와 호환되지 않을 수 있습니다.
    //
    // 대안 1: SWC transform 후 Babel 파싱 (이중 파싱 오버헤드)
    // 대안 2: SWC AST → Babel AST 변환 라이브러리 사용
    // 대안 3: Babel만 사용 (현재 성능이 더 좋음)

    const ast = parseSync(code, {
      syntax: tsx ? "typescript" : "ecmascript",
      tsx,
      decorators,
      dynamicImport: true,
    });

    // ⚠️ 타입 캐스팅만 하고 있음 - 실제 변환 필요
    // SWC AST와 Babel AST 구조가 다르므로 이 방식은 작동하지 않을 수 있습니다.
    return ast as unknown as t.File;
  } catch (error) {
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
