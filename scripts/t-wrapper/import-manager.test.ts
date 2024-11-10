/**
 * import-manager 테스트
 * Import 관리 로직 테스트
 */

import { createUseTranslationHook, addImportIfNeeded } from "./import-manager";
import { parse } from "@babel/parser";
import * as t from "@babel/types";

describe("import-manager", () => {
  describe("createUseTranslationHook", () => {
    it("useTranslation 훅을 생성해야 함", () => {
      const hook = createUseTranslationHook();
      expect(t.isVariableDeclaration(hook)).toBe(true);
      expect(hook.declarations.length).toBe(1);
      expect(t.isCallExpression(hook.declarations[0].init)).toBe(true);
      if (t.isCallExpression(hook.declarations[0].init)) {
        expect(t.isIdentifier(hook.declarations[0].init.callee)).toBe(true);
        if (t.isIdentifier(hook.declarations[0].init.callee)) {
          expect(hook.declarations[0].init.callee.name).toBe("useTranslation");
        }
      }
    });

    it("구조 분해 할당으로 t를 추출해야 함", () => {
      const hook = createUseTranslationHook();
      const declarator = hook.declarations[0];
      expect(t.isObjectPattern(declarator.id)).toBe(true);
    });
  });

  describe("addImportIfNeeded", () => {
    it("import가 없으면 추가해야 함", () => {
      const code = `function Component() {}`;
      const ast = parse(code, { sourceType: "module", plugins: ["typescript", "jsx"] });
      const result = addImportIfNeeded(ast, "next-i18next");
      expect(result).toBe(true);
      expect(ast.program.body[0].type).toBe("ImportDeclaration");
    });

    it("import가 이미 있으면 추가하지 않아야 함", () => {
      const code = `import { useTranslation } from "next-i18next";
function Component() {}`;
      const ast = parse(code, { sourceType: "module", plugins: ["typescript", "jsx"] });
      const result = addImportIfNeeded(ast, "next-i18next");
      expect(result).toBe(false);
      const imports = ast.program.body.filter((node) => node.type === "ImportDeclaration");
      expect(imports.length).toBe(1);
    });

    it("같은 소스의 import가 있지만 useTranslation이 없으면 추가해야 함", () => {
      const code = `import { other } from "next-i18next";
function Component() {}`;
      const ast = parse(code, { sourceType: "module", plugins: ["typescript", "jsx"] });
      const result = addImportIfNeeded(ast, "next-i18next");
      expect(result).toBe(false);
      const importNode = ast.program.body.find(
        (node) => node.type === "ImportDeclaration"
      ) as t.ImportDeclaration;
      expect(importNode).toBeDefined();
      const hasUseTranslation = importNode.specifiers.some(
        (spec) =>
          t.isImportSpecifier(spec) &&
          t.isIdentifier(spec.imported) &&
          spec.imported.name === "useTranslation"
      );
      expect(hasUseTranslation).toBe(true);
    });

    it("다른 소스의 import는 무시해야 함", () => {
      const code = `import { something } from "other-package";
function Component() {}`;
      const ast = parse(code, { sourceType: "module", plugins: ["typescript", "jsx"] });
      const result = addImportIfNeeded(ast, "next-i18next");
      expect(result).toBe(true);
      const imports = ast.program.body.filter(
        (node) =>
          node.type === "ImportDeclaration" &&
          (node as t.ImportDeclaration).source.value === "next-i18next"
      );
      expect(imports.length).toBe(1);
    });
  });
});

