/**
 * output-generator 테스트
 * 출력 생성 로직 테스트
 */

import * as fs from "fs";
import * as path from "path";
import {
  generateOutputData,
  generateGoogleSheetsCSV,
  generateIndexFile,
  generateNamespaceIndexFile,
  writeOutputFile,
  writeOutputFileWithNamespace,
} from "./output-generator";
import { ExtractedKey } from "./key-extractor";
import {
  createTempDir,
  cleanupTempDir,
  readFileContent,
  fileExists,
  readJsonFile,
} from "../__tests__/test-utils";

describe("output-generator", () => {
  describe("generateOutputData", () => {
    it("ExtractedKey 배열을 키-값 객체로 변환해야 함", () => {
      const keys: ExtractedKey[] = [
        { key: "hello.world", defaultValue: "안녕하세요" },
        { key: "goodbye", defaultValue: "안녕히가세요" },
      ];
      const result = generateOutputData(keys, { outputFormat: "json" });
      expect(result).toEqual({
        "hello.world": "안녕하세요",
        goodbye: "안녕히가세요",
      });
    });

    it("defaultValue가 없으면 키를 값으로 사용해야 함", () => {
      const keys: ExtractedKey[] = [{ key: "hello.world" }];
      const result = generateOutputData(keys, { outputFormat: "json" });
      expect(result).toEqual({
        "hello.world": "hello.world",
      });
    });

    it("중복 키는 마지막 값으로 덮어써야 함", () => {
      const keys: ExtractedKey[] = [
        { key: "hello", defaultValue: "첫번째" },
        { key: "hello", defaultValue: "두번째" },
      ];
      const result = generateOutputData(keys, { outputFormat: "json" });
      expect(result).toEqual({
        hello: "두번째",
      });
    });

    it("sortKeys 옵션이 있으면 정렬해야 함", () => {
      const keys: ExtractedKey[] = [
        { key: "zebra", defaultValue: "얼룩말" },
        { key: "apple", defaultValue: "사과" },
      ];
      const result = generateOutputData(keys, {
        outputFormat: "json",
        sortKeys: true,
      });
      const keysArray = Object.keys(result);
      expect(keysArray[0]).toBe("apple");
      expect(keysArray[1]).toBe("zebra");
    });
  });

  describe("generateGoogleSheetsCSV", () => {
    it("CSV 형식으로 변환해야 함", () => {
      const keys: ExtractedKey[] = [
        { key: "hello.world", defaultValue: "안녕하세요" },
        { key: "goodbye", defaultValue: "안녕히가세요" },
      ];
      const csv = generateGoogleSheetsCSV(keys);
      expect(csv).toContain("Key,English,Korean");
      expect(csv).toContain("hello.world");
      expect(csv).toContain("안녕하세요");
    });

    it("쉼표가 포함된 값은 이스케이프 처리해야 함", () => {
      const keys: ExtractedKey[] = [
        { key: "test", defaultValue: "안녕,하세요" },
      ];
      const csv = generateGoogleSheetsCSV(keys);
      expect(csv).toContain('"안녕,하세요"');
    });

    it("따옴표가 포함된 값은 이스케이프 처리해야 함", () => {
      const keys: ExtractedKey[] = [
        { key: "test", defaultValue: '안녕 "하세요"' },
      ];
      const csv = generateGoogleSheetsCSV(keys);
      expect(csv).toContain('"안녕 ""하세요"""');
    });

    it("줄바꿈이 포함된 값은 이스케이프 처리해야 함", () => {
      const keys: ExtractedKey[] = [
        { key: "multiline", defaultValue: "첫번째 줄\n두번째 줄" },
      ];
      const csv = generateGoogleSheetsCSV(keys);
      expect(csv).toContain('"첫번째 줄\n두번째 줄"');
    });
  });

  describe("generateIndexFile", () => {
    let tempDir: string;

    beforeEach(() => {
      tempDir = createTempDir();
    });

    afterEach(() => {
      cleanupTempDir(tempDir);
    });

    it("레거시 모드용 index.ts 파일을 생성해야 함", () => {
      const languages = ["en", "ko"];
      generateIndexFile(languages, tempDir, false);

      const indexPath = path.join(tempDir, "index.ts");
      expect(fileExists(indexPath)).toBe(true);

      const content = readFileContent(indexPath);
      expect(content).toContain('import en from "./en.json"');
      expect(content).toContain('import ko from "./ko.json"');
      expect(content).toContain("export const translations");
    });

    it("dryRun 모드에서는 파일을 생성하지 않아야 함", () => {
      generateIndexFile(["en", "ko"], tempDir, true);

      const indexPath = path.join(tempDir, "index.ts");
      expect(fileExists(indexPath)).toBe(false);
    });
  });

  describe("generateNamespaceIndexFile", () => {
    let tempDir: string;

    beforeEach(() => {
      tempDir = createTempDir();
    });

    afterEach(() => {
      cleanupTempDir(tempDir);
    });

    it("네임스페이스 모드용 index.ts 파일을 생성해야 함", () => {
      const namespaces = ["common", "dashboard"];
      const languages = ["en", "ko"];
      generateNamespaceIndexFile(
        namespaces,
        languages,
        tempDir,
        "common",
        false,
        true,
      );

      const indexPath = path.join(tempDir, "index.ts");
      expect(fileExists(indexPath)).toBe(true);

      const content = readFileContent(indexPath);
      expect(content).toContain("loadNamespace");
      expect(content).toContain("fallbackNamespace");
    });

    it("useI18nexusLibrary가 false이면 파일을 생성하지 않아야 함", () => {
      generateNamespaceIndexFile(
        ["common"],
        ["en", "ko"],
        tempDir,
        "common",
        false,
        false,
      );

      const indexPath = path.join(tempDir, "index.ts");
      expect(fileExists(indexPath)).toBe(false);
    });

    it("dryRun 모드에서는 파일을 생성하지 않아야 함", () => {
      generateNamespaceIndexFile(
        ["common"],
        ["en", "ko"],
        tempDir,
        "common",
        true,
        true,
      );

      const indexPath = path.join(tempDir, "index.ts");
      expect(fileExists(indexPath)).toBe(false);
    });
  });

  describe("writeOutputFile", () => {
    let tempDir: string;

    beforeEach(() => {
      tempDir = createTempDir();
    });

    afterEach(() => {
      cleanupTempDir(tempDir);
    });

    it("JSON 형식으로 언어별 파일을 생성해야 함", () => {
      const data = {
        "welcome.title": "환영합니다",
        "button.save": "저장",
      };

      writeOutputFile(data, {
        outputFormat: "json",
        languages: ["en", "ko"],
        outputDir: tempDir,
        outputFile: "translations.json",
        dryRun: false,
      });

      const enFile = path.join(tempDir, "en.json");
      const koFile = path.join(tempDir, "ko.json");

      expect(fileExists(enFile)).toBe(true);
      expect(fileExists(koFile)).toBe(true);

      const koData = readJsonFile(koFile);
      expect(koData["welcome.title"]).toBe("환영합니다");
    });

    it("force 모드에서는 기존 번역을 덮어써야 함", () => {
      // 기존 파일 생성
      fs.mkdirSync(tempDir, { recursive: true });
      fs.writeFileSync(
        path.join(tempDir, "ko.json"),
        JSON.stringify({ "old.key": "기존 값" }, null, 2),
      );

      const data = {
        "new.key": "새 값",
      };

      writeOutputFile(data, {
        outputFormat: "json",
        languages: ["ko"],
        outputDir: tempDir,
        outputFile: "translations.json",
        force: true,
        dryRun: false,
      });

      const koData = readJsonFile(path.join(tempDir, "ko.json"));
      expect(koData["old.key"]).toBeUndefined();
      expect(koData["new.key"]).toBe("새 값");
    });

    it("기본 모드에서는 기존 번역을 유지하고 새 키만 추가해야 함", () => {
      // 기존 파일 생성
      fs.mkdirSync(tempDir, { recursive: true });
      fs.writeFileSync(
        path.join(tempDir, "ko.json"),
        JSON.stringify({ "old.key": "기존 값" }, null, 2),
      );

      const data = {
        "new.key": "새 값",
      };

      writeOutputFile(data, {
        outputFormat: "json",
        languages: ["ko"],
        outputDir: tempDir,
        outputFile: "translations.json",
        force: false,
        dryRun: false,
      });

      const koData = readJsonFile(path.join(tempDir, "ko.json"));
      expect(koData["old.key"]).toBe("기존 값");
      expect(koData["new.key"]).toBe("새 값");
    });

    it("CSV 형식으로 파일을 생성해야 함", () => {
      const csvData = "Key,English,Korean\nhello,Hello,안녕하세요";

      writeOutputFile(csvData, {
        outputFormat: "csv",
        languages: ["en", "ko"],
        outputDir: tempDir,
        outputFile: "translations.json",
        dryRun: false,
      });

      const csvFile = path.join(tempDir, "translations.csv");
      expect(fileExists(csvFile)).toBe(true);
      const content = readFileContent(csvFile);
      expect(content).toContain("Key,English,Korean");
    });

    it("dryRun 모드에서는 파일을 생성하지 않아야 함", () => {
      const data = { "test.key": "테스트" };

      writeOutputFile(data, {
        outputFormat: "json",
        languages: ["ko"],
        outputDir: tempDir,
        outputFile: "translations.json",
        dryRun: true,
      });

      const koFile = path.join(tempDir, "ko.json");
      expect(fileExists(koFile)).toBe(false);
    });
  });

  describe("writeOutputFileWithNamespace", () => {
    let tempDir: string;

    beforeEach(() => {
      tempDir = createTempDir();
    });

    afterEach(() => {
      cleanupTempDir(tempDir);
    });

    it("네임스페이스별 디렉토리에 JSON 파일을 생성해야 함", () => {
      const data = {
        "welcome.title": "환영합니다",
        "button.save": "저장",
      };

      writeOutputFileWithNamespace(data, {
        outputFormat: "json",
        languages: ["en", "ko"],
        outputDir: tempDir,
        namespace: "common",
        dryRun: false,
      });

      const enFile = path.join(tempDir, "common", "en.json");
      const koFile = path.join(tempDir, "common", "ko.json");

      expect(fileExists(enFile)).toBe(true);
      expect(fileExists(koFile)).toBe(true);

      const koData = readJsonFile(koFile);
      expect(koData["welcome.title"]).toBe("환영합니다");
    });

    it("force 모드에서는 기존 번역을 덮어써야 함", () => {
      const namespaceDir = path.join(tempDir, "dashboard");
      fs.mkdirSync(namespaceDir, { recursive: true });
      fs.writeFileSync(
        path.join(namespaceDir, "ko.json"),
        JSON.stringify({ "old.key": "기존 값" }, null, 2),
      );

      const data = {
        "new.key": "새 값",
      };

      writeOutputFileWithNamespace(data, {
        outputFormat: "json",
        languages: ["ko"],
        outputDir: tempDir,
        namespace: "dashboard",
        force: true,
        dryRun: false,
      });

      const koData = readJsonFile(path.join(namespaceDir, "ko.json"));
      expect(koData["old.key"]).toBeUndefined();
      expect(koData["new.key"]).toBe("새 값");
    });

    it("CSV 형식으로 네임스페이스별 파일을 생성해야 함", () => {
      const csvData = "Key,English,Korean\nhello,Hello,안녕하세요";

      writeOutputFileWithNamespace(csvData, {
        outputFormat: "csv",
        languages: ["en", "ko"],
        outputDir: tempDir,
        namespace: "common",
        dryRun: false,
      });

      const csvFile = path.join(tempDir, "common.csv");
      expect(fileExists(csvFile)).toBe(true);
    });

    it("기존 번역 파일 파싱 실패 시 경고만 출력하고 계속 진행해야 함", () => {
      const namespaceDir = path.join(tempDir, "common");
      fs.mkdirSync(namespaceDir, { recursive: true });
      // 잘못된 JSON 파일 생성
      fs.writeFileSync(path.join(namespaceDir, "ko.json"), "invalid json");

      const data = {
        "new.key": "새 값",
      };

      // 에러가 발생하지 않아야 함
      expect(() => {
        writeOutputFileWithNamespace(data, {
          outputFormat: "json",
          languages: ["ko"],
          outputDir: tempDir,
          namespace: "common",
          dryRun: false,
        });
      }).not.toThrow();
    });
  });
});
