/**
 * 테스트 유틸리티 함수들
 * 모든 테스트에서 공통으로 사용되는 헬퍼 함수들을 제공합니다.
 */

import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import { I18nexusConfig } from "../config-loader";
import { sheets_v4 } from "googleapis";

/**
 * 임시 디렉토리 생성
 * @returns 생성된 임시 디렉토리 경로
 */
export function createTempDir(): string {
  const tempDir = path.join(
    os.tmpdir(),
    `i18nexus-test-${Date.now()}-${Math.random().toString(36).substring(7)}`,
  );
  fs.mkdirSync(tempDir, { recursive: true });
  return tempDir;
}

/**
 * 임시 디렉토리 정리
 * @param dir 정리할 디렉토리 경로
 */
export function cleanupTempDir(dir: string): void {
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

/**
 * Mock I18nexusConfig 생성
 * @param overrides 덮어쓸 설정 값
 * @returns Mock 설정 객체
 */
export function createMockConfig(
  overrides?: Partial<I18nexusConfig>,
): I18nexusConfig {
  return {
    languages: ["en", "ko"],
    defaultLanguage: "ko",
    localesDir: "./locales",
    sourcePattern: "src/**/*.{ts,tsx}",
    translationImportSource: "i18nexus",
    fallbackNamespace: "common",
    ...overrides,
  };
}

/**
 * Mock Google Sheets API 클라이언트 생성
 * @returns Mock된 Sheets API 클라이언트
 */
export function createMockGoogleSheets(): jest.Mocked<sheets_v4.Sheets> {
  const mockSheets = {
    spreadsheets: {
      get: jest.fn(),
      batchUpdate: jest.fn(),
      values: {
        get: jest.fn(),
        update: jest.fn(),
        append: jest.fn(),
        clear: jest.fn(),
      },
    },
  } as unknown as jest.Mocked<sheets_v4.Sheets>;

  return mockSheets;
}

/**
 * 샘플 번역 데이터 생성
 * @param namespaces 네임스페이스 목록
 * @param languages 언어 목록
 * @returns 번역 데이터 객체
 */
export function createSampleTranslations(
  namespaces: string[] = ["common", "dashboard"],
  languages: string[] = ["en", "ko"],
): Record<string, Record<string, Record<string, string>>> {
  const translations: Record<
    string,
    Record<string, Record<string, string>>
  > = {};

  for (const namespace of namespaces) {
    translations[namespace] = {};
    for (const lang of languages) {
      translations[namespace][lang] = {
        [`${namespace}.title`]: `${namespace} Title (${lang})`,
        [`${namespace}.description`]: `${namespace} Description (${lang})`,
      };
    }
  }

  return translations;
}

/**
 * 임시 파일 생성
 * @param dir 디렉토리 경로
 * @param filename 파일명
 * @param content 파일 내용
 * @returns 생성된 파일 경로
 */
export function createTempFile(
  dir: string,
  filename: string,
  content: string,
): string {
  const filePath = path.join(dir, filename);
  const dirPath = path.dirname(filePath);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
  fs.writeFileSync(filePath, content, "utf-8");
  return filePath;
}

/**
 * 임시 JSON 파일 생성
 * @param dir 디렉토리 경로
 * @param filename 파일명
 * @param data JSON 데이터
 * @returns 생성된 파일 경로
 */
export function createTempJsonFile(
  dir: string,
  filename: string,
  data: any,
): string {
  return createTempFile(dir, filename, JSON.stringify(data, null, 2));
}

/**
 * 디렉토리 구조 생성
 * @param baseDir 기준 디렉토리
 * @param structure 디렉토리 구조 (객체 형태)
 */
export function createDirStructure(
  baseDir: string,
  structure: Record<string, any>,
): void {
  for (const [key, value] of Object.entries(structure)) {
    const itemPath = path.join(baseDir, key);
    if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      fs.mkdirSync(itemPath, { recursive: true });
      createDirStructure(itemPath, value);
    } else {
      const dirPath = path.dirname(itemPath);
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
      }
      if (typeof value === "string") {
        fs.writeFileSync(itemPath, value, "utf-8");
      } else {
        fs.writeFileSync(itemPath, JSON.stringify(value, null, 2), "utf-8");
      }
    }
  }
}

/**
 * 파일 존재 여부 확인
 * @param filePath 파일 경로
 * @returns 존재 여부
 */
export function fileExists(filePath: string): boolean {
  return fs.existsSync(filePath);
}

/**
 * 파일 내용 읽기
 * @param filePath 파일 경로
 * @returns 파일 내용
 */
export function readFileContent(filePath: string): string {
  return fs.readFileSync(filePath, "utf-8");
}

/**
 * JSON 파일 읽기
 * @param filePath 파일 경로
 * @returns 파싱된 JSON 객체
 */
export function readJsonFile(filePath: string): any {
  return JSON.parse(readFileContent(filePath));
}
