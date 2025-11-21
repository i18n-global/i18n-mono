/**
 * import-manager 테스트
 * Import 관리 로직 테스트
 */

import {
  ensureNamedImport,
} from "./import-manager";
import { parse } from "@babel/parser";
import * as t from "@babel/types";

describe("import-manager", () => {
  describe("ensureNamedImport", () => {
    it("import가 없으면 추가해야 함", () => {
      const code = `function Component() {}`;
      const ast = parse(code, {
        sourceType: "module",
        plugins: ["typescript", "jsx"],
      });
      const result = ensureNamedImport(ast, "next-i18next", "useTranslation");
      expect(result).toBe(true);
      expect(ast.program.body[0].type).toBe("ImportDeclaration");
    });

    it("import가 이미 있으면 추가하지 않아야 함", () => {
      const code = `import { useTranslation } from "next-i18next";
function Component() {}`;
      const ast = parse(code, {
        sourceType: "module",
        plugins: ["typescript", "jsx"],
      });
      const result = ensureNamedImport(ast, "next-i18next", "useTranslation");
      expect(result).toBe(true);
      const imports = ast.program.body.filter(
        (node) => node.type === "ImportDeclaration"
      );
      expect(imports.length).toBe(1);
    });

    it("같은 소스의 import가 있지만 specifier가 없으면 추가해야 함", () => {
      const code = `import { other } from "next-i18next";
function Component() {}`;
      const ast = parse(code, {
        sourceType: "module",
        plugins: ["typescript", "jsx"],
      });
      const result = ensureNamedImport(ast, "next-i18next", "useTranslation");
      expect(result).toBe(true);
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

    it("임의의 named import를 추가할 수 있어야 함", () => {
      const code = `function Component() {}`;
      const ast = parse(code, {
        sourceType: "module",
        plugins: ["typescript", "jsx"],
      });
      const result = ensureNamedImport(ast, "i18nexus", "getServerTranslation");
      expect(result).toBe(true);
      const importNode = ast.program.body[0] as t.ImportDeclaration;
      expect(importNode.specifiers[0]).toBeDefined();
      expect(
        t.isImportSpecifier(importNode.specifiers[0]) &&
          t.isIdentifier(importNode.specifiers[0].imported) &&
          importNode.specifiers[0].imported.name === "getServerTranslation"
      ).toBe(true);
    });
  });
});
