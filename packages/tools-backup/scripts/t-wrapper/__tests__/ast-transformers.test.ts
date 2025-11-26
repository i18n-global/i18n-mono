/**
 * ast-transformers 테스트
 * AST 변환 로직 테스트
 */

import { transformFunctionBody } from "../ast/ast-transformers";
import { parse } from "@babel/parser";
import traverse, { NodePath } from "@babel/traverse";
import * as t from "@babel/types";

describe("ast-transformers", () => {
  describe("transformFunctionBody", () => {
    it("한국어 문자열 리터럴을 t() 호출로 변환해야 함", () => {
      const code = `function Component() {
  const text = "안녕하세요";
  return <div>{text}</div>;
}`;
      const ast = parse(code, { sourceType: "module", plugins: ["typescript", "jsx"] });
      let wasModified = false;
      traverse(ast, {
        FunctionDeclaration(path) {
          const result = transformFunctionBody(path, code);
          wasModified = result.wasModified;
        },
      });
      expect(wasModified).toBe(true);
    });

    it("한국어 템플릿 리터럴을 t() 호출로 변환해야 함", () => {
      const code = `function Component() {
  return <div>{\`안녕 \${name}\`}</div>;
}`;
      const ast = parse(code, { sourceType: "module", plugins: ["typescript", "jsx"] });
      let wasModified = false;
      traverse(ast, {
        FunctionDeclaration(path) {
          const result = transformFunctionBody(path, code);
          wasModified = result.wasModified;
        },
      });
      expect(wasModified).toBe(true);
    });

    it("멤버 표현식(user.name)이 포함된 템플릿 리터럴을 변환해야 함", () => {
      const code = `function Component() {
  const user = { name: "홍길동" };
  return <div>{\`안녕하세요 \${user.name}님\`}</div>;
}`;
      const ast = parse(code, { sourceType: "module", plugins: ["typescript", "jsx"] });
      let wasModified = false;
      
      traverse(ast, {
        FunctionDeclaration(path) {
          const result = transformFunctionBody(path, code);
          wasModified = result.wasModified;
        },
      });
      
      expect(wasModified).toBe(true);
    });

    it("중첩된 멤버 표현식(user.profile.name)이 포함된 템플릿 리터럴을 변환해야 함", () => {
      const code = `function Component() {
  const user = { profile: { name: "홍길동" } };
  return <div>{\`안녕하세요 \${user.profile.name}님\`}</div>;
}`;
      const ast = parse(code, { sourceType: "module", plugins: ["typescript", "jsx"] });
      let wasModified = false;
      
      traverse(ast, {
        FunctionDeclaration(path) {
          const result = transformFunctionBody(path, code);
          wasModified = result.wasModified;
        },
      });
      
      expect(wasModified).toBe(true);
    });

    it("한국어 JSXText를 t() 호출로 변환해야 함", () => {
      const code = `function Component() {
  return <div>안녕하세요</div>;
}`;
      const ast = parse(code, { sourceType: "module", plugins: ["typescript", "jsx"] });
      let wasModified = false;
      traverse(ast, {
        FunctionDeclaration(path) {
          const result = transformFunctionBody(path, code);
          wasModified = result.wasModified;
        },
      });
      expect(wasModified).toBe(true);
    });

    it("이미 t()로 래핑된 문자열은 변환하지 않아야 함", () => {
      const code = `function Component() {
  return <div>{t("key")}</div>;
}`;
      const ast = parse(code, { sourceType: "module", plugins: ["typescript", "jsx"] });
      let wasModified = false;
      traverse(ast, {
        FunctionDeclaration(path) {
          const result = transformFunctionBody(path, code);
          wasModified = result.wasModified;
        },
      });
      expect(wasModified).toBe(false);
    });

    it("i18n-ignore 주석이 있으면 변환하지 않아야 함", () => {
      const code = `function Component() {
  // i18n-ignore
  return <div>Hello</div>;
}`;
      const ast = parse(code, { sourceType: "module", plugins: ["typescript", "jsx"] });
      let wasModified = false;
      traverse(ast, {
        FunctionDeclaration(path) {
          const result = transformFunctionBody(path, code);
          wasModified = result.wasModified;
        },
      });
      expect(wasModified).toBe(false);
    });
  });
});

