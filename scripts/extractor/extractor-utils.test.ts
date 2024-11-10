/**
 * extractor-utils 테스트
 * 순수 함수들 테스트
 */

import {
  isTFunction,
  getDefaultValue,
  escapeCsvValue,
} from "./extractor-utils";
import * as t from "@babel/types";

describe("extractor-utils", () => {
  describe("isTFunction", () => {
    it("t() 직접 호출을 감지해야 함", () => {
      const callee = t.identifier("t");
      expect(isTFunction(callee)).toBe(true);
    });

    it("useTranslation().t 형태를 감지해야 함", () => {
      const callee = t.memberExpression(
        t.callExpression(t.identifier("useTranslation"), []),
        t.identifier("t")
      );
      expect(isTFunction(callee)).toBe(true);
    });

    it("다른 함수 호출은 false를 반환해야 함", () => {
      const callee = t.identifier("translate");
      expect(isTFunction(callee)).toBe(false);
    });
  });

  describe("getDefaultValue", () => {
    it("defaultValue가 있으면 추출해야 함", () => {
      const args: t.Expression[] = [
        t.stringLiteral("key"),
        t.objectExpression([
          t.objectProperty(
            t.identifier("defaultValue"),
            t.stringLiteral("기본값")
          ),
        ]),
      ];
      expect(getDefaultValue(args)).toBe("기본값");
    });

    it("defaultValue가 없으면 undefined를 반환해야 함", () => {
      const args: t.Expression[] = [t.stringLiteral("key")];
      expect(getDefaultValue(args)).toBeUndefined();
    });

    it("옵션 객체에 defaultValue가 없으면 undefined를 반환해야 함", () => {
      const args: t.Expression[] = [
        t.stringLiteral("key"),
        t.objectExpression([
          t.objectProperty(t.identifier("ns"), t.stringLiteral("namespace")),
        ]),
      ];
      expect(getDefaultValue(args)).toBeUndefined();
    });
  });

  describe("escapeCsvValue", () => {
    it("일반 문자열은 그대로 반환해야 함", () => {
      expect(escapeCsvValue("hello")).toBe("hello");
    });

    it("쉼표가 있으면 따옴표로 감싸야 함", () => {
      expect(escapeCsvValue("hello,world")).toBe('"hello,world"');
    });

    it("따옴표가 있으면 두 번 반복해야 함", () => {
      expect(escapeCsvValue('say "hello"')).toBe('"say ""hello"""');
    });

    it("개행 문자가 있으면 따옴표로 감싸야 함", () => {
      expect(escapeCsvValue("hello\nworld")).toBe('"hello\nworld"');
    });
  });
});
