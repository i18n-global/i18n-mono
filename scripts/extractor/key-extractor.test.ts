/**
 * key-extractor 테스트
 * 키 추출 로직 테스트
 */

import { extractTranslationKey, createExtractedKey, ExtractedKey } from "./key-extractor";
import * as t from "@babel/types";
import { parse } from "@babel/parser";
import traverse from "@babel/traverse";

describe("key-extractor", () => {
  describe("extractTranslationKey", () => {
    it("t() 호출에서 키를 추출해야 함", () => {
      const code = `t("hello.world");`;
      const ast = parse(code, { sourceType: "module", plugins: ["typescript", "jsx"] });
      let extracted: ExtractedKey | null = null;
      traverse(ast, {
        CallExpression(path) {
          if (t.isIdentifier(path.node.callee, { name: "t" })) {
            extracted = extractTranslationKey(path, "test.ts");
          }
        },
      });
      expect(extracted).not.toBeNull();
      expect(extracted?.key).toBe("hello.world");
    });

    it("템플릿 리터럴은 null을 반환해야 함", () => {
      const code = `t(\`hello.\${name}\`);`;
      const ast = parse(code, { sourceType: "module", plugins: ["typescript", "jsx"] });
      let extracted: ExtractedKey | null = null;
      traverse(ast, {
        CallExpression(path) {
          if (t.isIdentifier(path.node.callee, { name: "t" })) {
            extracted = extractTranslationKey(path, "test.ts");
          }
        },
      });
      expect(extracted).toBeNull();
    });

    it("첫 번째 인수가 문자열이 아니면 null을 반환해야 함", () => {
      const code = `t(variable);`;
      const ast = parse(code, { sourceType: "module", plugins: ["typescript", "jsx"] });
      let extracted: ExtractedKey | null = null;
      traverse(ast, {
        CallExpression(path) {
          if (t.isIdentifier(path.node.callee, { name: "t" })) {
            extracted = extractTranslationKey(path, "test.ts");
          }
        },
      });
      expect(extracted).toBeNull();
    });
  });

  describe("createExtractedKey", () => {
    it("기본 키로 ExtractedKey를 생성해야 함", () => {
      const callExpr = t.callExpression(t.identifier("t"), [t.stringLiteral("hello.world")]);
      callExpr.loc = {
        start: { line: 10, column: 0 },
        end: { line: 10, column: 20 },
      } as any;
      const key = createExtractedKey("hello.world", callExpr, "src/component.tsx");
      expect(key.key).toBe("hello.world");
      expect(key.defaultValue).toBeUndefined();
    });

    it("defaultValue가 있으면 포함해야 함", () => {
      const callExpr = t.callExpression(t.identifier("t"), [
        t.stringLiteral("hello.world"),
        t.objectExpression([
          t.objectProperty(t.identifier("defaultValue"), t.stringLiteral("기본값")),
        ]),
      ]);
      callExpr.loc = {
        start: { line: 10, column: 0 },
        end: { line: 10, column: 20 },
      } as any;
      const key = createExtractedKey("hello.world", callExpr, "src/component.tsx");
      expect(key.key).toBe("hello.world");
      expect(key.defaultValue).toBe("기본값");
    });
  });
});

