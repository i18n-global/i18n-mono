/**
 * 테스트 유틸리티 함수
 */

import * as fs from "fs";
import * as path from "path";

/**
 * 파일에 내용을 작성
 */
export function setFile(filePath: string, content: string): void {
  fs.writeFileSync(filePath, content, "utf-8");
}

/**
 * 파일 내용을 읽기
 */
export function readFile(filePath: string): string {
  return fs.readFileSync(filePath, "utf-8");
}

