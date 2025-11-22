import { parse } from "@babel/parser";
import traverse, { NodePath } from "@babel/traverse";
import * as t from "@babel/types";
import { applyTranslationsToAST, writeASTToFile } from "./translation-applier";
import { ScriptConfig } from "../common/default-config";
import { writeFile, readFile, createTempDir, removeDir } from "./fs-utils";
import * as path from "path";

describe("translation-applier", () => {
  describe("applyTranslationsToAST", () => {
    it("Next.js client 모드에서 'use client' 디렉티브를 추가해야 함", () => {
      const code = `function Component() {
  return <div>안녕하세요</div>;
}`;

      const ast = parse(code, {
        sourceType: "module",
        plugins: ["jsx", "typescript"],
      });

      const modifiedComponentPaths: NodePath<t.Function>[] = [];
      traverse(ast, {
        FunctionDeclaration: (path) => {
          modifiedComponentPaths.push(path);
        },
      });

      const config = {
        mode: "client" as const,
        framework: "nextjs" as const,
        translationImportSource: "i18nexus",
        parserType: "babel" as const,
        sourcePattern: "src/**/*.{js,jsx,ts,tsx}",
        serverTranslationFunction: "getServerTranslation",
      } as Required<ScriptConfig>;

      applyTranslationsToAST(ast, modifiedComponentPaths, config);

      const output = require("@babel/generator").default(ast).code;
      expect(output).toMatch(/["']use client["']/);
      expect(output).toContain("useTranslation");
    });

    it("React 환경에서는 'use client' 디렉티브를 추가하지 않아야 함", () => {
      const code = `function Component() {
  return <div>안녕하세요</div>;
}`;

      const ast = parse(code, {
        sourceType: "module",
        plugins: ["jsx", "typescript"],
      });

      const modifiedComponentPaths: NodePath<t.Function>[] = [];
      traverse(ast, {
        FunctionDeclaration: (path) => {
          modifiedComponentPaths.push(path);
        },
      });

      const config = {
        mode: "client" as const,
        framework: "react" as const,
        translationImportSource: "i18nexus",
        parserType: "babel" as const,
        sourcePattern: "src/**/*.{js,jsx,ts,tsx}",
        serverTranslationFunction: "getServerTranslation",
      } as Required<ScriptConfig>;

      applyTranslationsToAST(ast, modifiedComponentPaths, config);

      const output = require("@babel/generator").default(ast).code;
      expect(output).not.toMatch(/["']use client["']/);
      expect(output).toContain("useTranslation");
    });

    it("server 모드에서 getServerTranslation을 사용해야 함", () => {
      const code = `function Component() {
  return <div>안녕하세요</div>;
}`;

      const ast = parse(code, {
        sourceType: "module",
        plugins: ["jsx", "typescript"],
      });

      const modifiedComponentPaths: NodePath<t.Function>[] = [];
      traverse(ast, {
        FunctionDeclaration: (path) => {
          modifiedComponentPaths.push(path);
        },
      });

      const config = {
        mode: "server" as const,
        framework: "nextjs" as const,
        translationImportSource: "i18nexus",
        parserType: "babel" as const,
        sourcePattern: "src/**/*.{js,jsx,ts,tsx}",
        serverTranslationFunction: "getServerTranslation",
      } as Required<ScriptConfig>;

      applyTranslationsToAST(ast, modifiedComponentPaths, config);

      const output = require("@babel/generator").default(ast).code;
      expect(output).toContain("await getServerTranslation");
      expect(output).toMatch(/const\s*{\s*t\s*}\s*=/);
    });

    it("이미 t 바인딩이 있으면 추가하지 않아야 함", () => {
      const code = `function Component() {
  const { t } = useTranslation();
  return <div>안녕하세요</div>;
}`;

      const ast = parse(code, {
        sourceType: "module",
        plugins: ["jsx", "typescript"],
      });

      const modifiedComponentPaths: NodePath<t.Function>[] = [];
      traverse(ast, {
        FunctionDeclaration: (path) => {
          modifiedComponentPaths.push(path);
        },
      });

      const config = {
        mode: "client" as const,
        framework: "react" as const,
        translationImportSource: "i18nexus",
        parserType: "babel" as const,
        sourcePattern: "src/**/*.{js,jsx,ts,tsx}",
        serverTranslationFunction: "getServerTranslation",
      } as Required<ScriptConfig>;

      applyTranslationsToAST(ast, modifiedComponentPaths, config);

      const output = require("@babel/generator").default(ast).code;
      // useTranslation이 한 번만 있어야 함
      const useTranslationCount = (output.match(/useTranslation/g) || []).length;
      expect(useTranslationCount).toBe(1);
    });

    it("화살표 함수의 concise body를 block statement로 변환해야 함", () => {
      const code = `const Component = () => <div>안녕하세요</div>;`;

      const ast = parse(code, {
        sourceType: "module",
        plugins: ["jsx", "typescript"],
      });

      const modifiedComponentPaths: NodePath<t.Function>[] = [];
      traverse(ast, {
        ArrowFunctionExpression: (path) => {
          if (
            t.isVariableDeclarator(path.parent) &&
            t.isIdentifier(path.parent.id)
          ) {
            modifiedComponentPaths.push(path);
          }
        },
      });

      const config = {
        mode: "client" as const,
        framework: "react" as const,
        translationImportSource: "i18nexus",
        parserType: "babel" as const,
        sourcePattern: "src/**/*.{js,jsx,ts,tsx}",
        serverTranslationFunction: "getServerTranslation",
      } as Required<ScriptConfig>;

      applyTranslationsToAST(ast, modifiedComponentPaths, config);

      const output = require("@babel/generator").default(ast).code;
      expect(output).toContain("useTranslation");
      expect(output).toContain("return");
    });
  });

  describe("writeASTToFile", () => {
    let tempDir: string;

    beforeEach(() => {
      tempDir = createTempDir("i18n-test-");
    });

    afterEach(() => {
      removeDir(tempDir);
    });

    it("AST를 파일로 쓰기", () => {
      const code = `function Component() {
  return <div>안녕하세요</div>;
}`;

      const ast = parse(code, {
        sourceType: "module",
        plugins: ["jsx", "typescript"],
      });

      const testFile = path.join(tempDir, "test.tsx");
      const config = {
        mode: "client" as const,
        framework: "react" as const,
        translationImportSource: "i18nexus",
        parserType: "babel" as const,
        sourcePattern: "src/**/*.{js,jsx,ts,tsx}",
        serverTranslationFunction: "getServerTranslation",
      } as Required<ScriptConfig>;

      writeASTToFile(ast, testFile, config);

      const writtenContent = readFile(testFile);
      expect(writtenContent).toContain("function Component");
      expect(writtenContent).toContain("안녕하세요");
    });
  });
});

