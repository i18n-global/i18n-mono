/**
 * output-generator 테스트
 * 출력 생성 로직 테스트
 */

import {
  generateOutputData,
  generateGoogleSheetsCSV,
  generateIndexFile,
} from "./output-generator";
import { ExtractedKey } from "./key-extractor";

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
      const result = generateOutputData(keys, { outputFormat: "json", sortKeys: true });
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
  });
});
