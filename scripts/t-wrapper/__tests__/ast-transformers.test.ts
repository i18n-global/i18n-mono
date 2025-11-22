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

    it("멤버 표현식(user.name)을 user_name으로 변환해야 함", () => {
      const code = `function Component() {
  const user = { name: "홍길동" };
  return <div>{\`안녕하세요 \${user.name}님\`}</div>;
}`;
      const ast = parse(code, { sourceType: "module", plugins: ["typescript", "jsx"] });
      let wasModified = false;
      let hasUserName = false;
      let hasInterpolation = false;
      
      traverse(ast, {
        FunctionDeclaration(path) {
          const result = transformFunctionBody(path, code);
          wasModified = result.wasModified;
        },
        CallExpression(callPath) {
          if (t.isIdentifier(callPath.node.callee, { name: "t" })) {
            // 첫 번째 인자(문자열)에 {{user_name}}이 있는지 확인
            const firstArg = callPath.node.arguments[0];
            if (t.isStringLiteral(firstArg)) {
              if (firstArg.value.includes("{{user_name}}")) {
                hasInterpolation = true;
              }
            }
            // 두 번째 인자(객체)에 user_name: user.name이 있는지 확인
            const secondArg = callPath.node.arguments[1];
            if (t.isObjectExpression(secondArg)) {
              const user_nameProp = secondArg.properties.find((prop) => {
                if (t.isObjectProperty(prop) && t.isIdentifier(prop.key)) {
                  return prop.key.name === "user_name";
                }
                return false;
              });
              if (user_nameProp) {
                hasUserName = true;
              }
            }
          }
        },
      });
      
      expect(wasModified).toBe(true);
      expect(hasInterpolation).toBe(true);
      expect(hasUserName).toBe(true);
    });

    it("중첩된 멤버 표현식(user.profile.name)을 user_profile_name으로 변환해야 함", () => {
      const code = `function Component() {
  const user = { profile: { name: "홍길동" } };
  return <div>{\`안녕하세요 \${user.profile.name}님\`}</div>;
}`;
      const ast = parse(code, { sourceType: "module", plugins: ["typescript", "jsx"] });
      let wasModified = false;
      let hasNestedInterpolation = false;
      let hasNestedProperty = false;
      
      traverse(ast, {
        FunctionDeclaration(path) {
          const result = transformFunctionBody(path, code);
          wasModified = result.wasModified;
        },
        CallExpression(callPath) {
          if (t.isIdentifier(callPath.node.callee, { name: "t" })) {
            const firstArg = callPath.node.arguments[0];
            if (t.isStringLiteral(firstArg)) {
              if (firstArg.value.includes("{{user_profile_name}}")) {
                hasNestedInterpolation = true;
              }
            }
            const secondArg = callPath.node.arguments[1];
            if (t.isObjectExpression(secondArg)) {
              const nestedProp = secondArg.properties.find((prop) => {
                if (t.isObjectProperty(prop) && t.isIdentifier(prop.key)) {
                  return prop.key.name === "user_profile_name";
                }
                return false;
              });
              if (nestedProp) {
                hasNestedProperty = true;
              }
            }
          }
        },
      });
      
      expect(wasModified).toBe(true);
      expect(hasNestedInterpolation).toBe(true);
      expect(hasNestedProperty).toBe(true);
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

