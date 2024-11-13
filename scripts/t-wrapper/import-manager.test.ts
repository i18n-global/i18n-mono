/**
 * import-manager 테스트
 * Import 관리 로직 테스트
 */

import { createUseTranslationHook, addImportIfNeeded } from "./import-manager";
import { parse } from "@babel/parser";
import * as t from "@babel/types";

describe("import-manager", () => {
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

  });
});

