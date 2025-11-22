/**
 * 테스트 유틸리티 함수
 * fs-utils를 래핑하여 테스트 친화적인 이름 제공
 */

import { writeFile, readFile, createTempDir, removeDir } from "./fs-utils";

/**
 * 파일에 내용을 작성 (테스트용 별칭)
 */
export const setFile = writeFile;

/**
 * 파일 내용을 읽기 (재export)
 */
export { readFile, createTempDir, removeDir };

