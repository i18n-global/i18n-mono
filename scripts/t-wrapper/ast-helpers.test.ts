/**
 * ast-helpers 테스트
 * 순수 함수들 테스트
 */

import {
  hasIgnoreComment,
  shouldSkipPath,
  isReactComponent,
  isReactCustomHook,
  isReactComponentOrHook,
  createTranslationBinding,
  hasTranslationFunctionCall,
} from "./ast-helpers";
import { parse } from "@babel/parser";
import traverse from "@babel/traverse";
import * as t from "@babel/types";

describe("ast-helpers", () => {
  describe("hasIgnoreComment", () => {
    it("leadingComments에 i18n-ignore가 있으면 true를 반환해야 함", () => {
      const code = `// i18n-ignore
const text = "hello";`;
      const ast = parse(code, {
        sourceType: "module",
        plugins: ["typescript", "jsx"],
      });
      let found = false;
      traverse(ast, {
        VariableDeclarator(path) {
          if (hasIgnoreComment(path)) {
            found = true;
          }
        },
      });
      expect(found).toBe(true);
    });
  });

  describe("shouldSkipPath", () => {
    it("i18n-ignore 주석이 있으면 true를 반환해야 함", () => {
      const code = `// i18n-ignore
const text = "hello";`;
      const ast = parse(code, {
        sourceType: "module",
        plugins: ["typescript", "jsx"],
      });
      let shouldSkip = false;
      traverse(ast, {
        StringLiteral(path) {
          if (shouldSkipPath(path, hasIgnoreComment)) {
            shouldSkip = true;
          }
        },
      });
      expect(shouldSkip).toBe(true);
    });

    it("이미 t()로 래핑된 경우 true를 반환해야 함", () => {
      const code = `const text = t("key");`;
      const ast = parse(code, {
        sourceType: "module",
        plugins: ["typescript", "jsx"],
      });
      let shouldSkip = false;
      traverse(ast, {
        StringLiteral(path) {
          if (shouldSkipPath(path, hasIgnoreComment)) {
            shouldSkip = true;
          }
        },
      });
      expect(shouldSkip).toBe(true);
    });
  });

  describe("isReactComponent", () => {
    it("대문자로 시작하는 이름은 컴포넌트로 인식해야 함", () => {
      expect(isReactComponent("Button")).toBe(true);
      expect(isReactComponent("MyComponent")).toBe(true);
    });

    it("소문자로 시작하는 이름은 컴포넌트로 인식하지 않아야 함", () => {
      expect(isReactComponent("button")).toBe(false);
      expect(isReactComponent("useState")).toBe(false);
      expect(isReactComponent("useMyHook")).toBe(false);
    });
  });

  describe("isReactCustomHook", () => {
    it("use로 시작하고 대문자로 이어지는 이름은 훅으로 인식해야 함", () => {
      expect(isReactCustomHook("useState")).toBe(true);
      expect(isReactCustomHook("useTranslation")).toBe(true);
      expect(isReactCustomHook("useMyHook")).toBe(true);
      expect(isReactCustomHook("useToast")).toBe(true);
    });

    it("use로 시작하지 않거나 소문자로 이어지는 이름은 훅으로 인식하지 않아야 함", () => {
      expect(isReactCustomHook("Component")).toBe(false);
      expect(isReactCustomHook("use-my-hook")).toBe(false);
      expect(isReactCustomHook("use_my_hook")).toBe(false);
    });
  });

  describe("isReactComponentOrHook", () => {
    it("컴포넌트와 훅 모두 인식해야 함", () => {
      expect(isReactComponentOrHook("Button")).toBe(true);
      expect(isReactComponentOrHook("MyComponent")).toBe(true);
      expect(isReactComponentOrHook("useState")).toBe(true);
      expect(isReactComponentOrHook("useMyHook")).toBe(true);
    });

    it("일반 함수는 인식하지 않아야 함", () => {
      expect(isReactComponentOrHook("formatDate")).toBe(false);
      expect(isReactComponentOrHook("getData")).toBe(false);
    });
  });

  describe("hasTranslationFunctionCall", () => {
    it("useTranslation 호출이 있으면 true를 반환해야 함", () => {
      const code = `function Component() {
        const { t } = useTranslation();
        return <div>{t("hello")}</div>;
      }`;
      const ast = parse(code, {
        sourceType: "module",
        plugins: ["typescript", "jsx"],
      });
      let found = false;
      traverse(ast, {
        FunctionDeclaration(path) {
          const body = path.get("body");
          if (hasTranslationFunctionCall(body, "useTranslation")) {
            found = true;
          }
        },
      });
      expect(found).toBe(true);
    });

    it("getServerTranslation 호출이 있으면 true를 반환해야 함", () => {
      const code = `async function Component() {
        const { t } = await getServerTranslation();
        return <div>{t("hello")}</div>;
      }`;
      const ast = parse(code, {
        sourceType: "module",
        plugins: ["typescript", "jsx"],
      });
      let found = false;
      traverse(ast, {
        FunctionDeclaration(path) {
          const body = path.get("body");
          if (hasTranslationFunctionCall(body, "getServerTranslation")) {
            found = true;
          }
        },
      });
      expect(found).toBe(true);
    });

    it("번역 함수 호출이 없으면 false를 반환해야 함", () => {
      const code = `function Component() {
        return <div>Hello</div>;
      }`;
      const ast = parse(code, {
        sourceType: "module",
        plugins: ["typescript", "jsx"],
      });
      let found = false;
      traverse(ast, {
        FunctionDeclaration(path) {
          const body = path.get("body");
          if (hasTranslationFunctionCall(body, "useTranslation")) {
            found = true;
          }
        },
      });
      expect(found).toBe(false);
    });

    it("concise body일 때는 false를 반환해야 함", () => {
      const code = `const Component = () => <div>Hello</div>;`;
      const ast = parse(code, {
        sourceType: "module",
        plugins: ["typescript", "jsx"],
      });
      let found = false;
      traverse(ast, {
        ArrowFunctionExpression(path) {
          const body = path.get("body");
          if (hasTranslationFunctionCall(body, "useTranslation")) {
            found = true;
          }
        },
      });
      expect(found).toBe(false);
    });
  });

  describe("createTranslationBinding", () => {
    it("client 모드로 useTranslation 바인딩을 생성해야 함", () => {
      const decl = createTranslationBinding("client");

      // 변수 선언 타입 확인
      expect(decl.type).toBe("VariableDeclaration");
      expect(decl.kind).toBe("const");

      // 변수 선언자가 1개인지 확인
      expect(decl.declarations).toHaveLength(1);
      const declarator = decl.declarations[0];

      // 구조 분해 패턴 확인
      expect(t.isObjectPattern(declarator.id)).toBe(true);
      
      if (t.isObjectPattern(declarator.id)) {
        expect(declarator.id.properties).toHaveLength(1);
        const property = declarator.id.properties[0];
        if (t.isObjectProperty(property) && t.isIdentifier(property.key)) {
          expect(property.key.name).toBe("t");
        }
      }

      // useTranslation 호출 확인
      expect(declarator.init).toBeDefined();
      expect(t.isCallExpression(declarator.init)).toBe(true);
      
      if (declarator.init && t.isCallExpression(declarator.init)) {
        if (t.isIdentifier(declarator.init.callee)) {
          expect(declarator.init.callee.name).toBe("useTranslation");
        }
        expect(declarator.init.arguments).toHaveLength(0);
      }
    });

    it("server 모드로 getServerTranslation 바인딩을 생성해야 함", () => {
      const decl = createTranslationBinding("server", "getServerTranslation");

      // 변수 선언 타입 확인
      expect(decl.type).toBe("VariableDeclaration");
      expect(decl.kind).toBe("const");

      // await 표현식 확인
      const declarator = decl.declarations[0];
      expect(declarator.init).toBeDefined();
      expect(t.isAwaitExpression(declarator.init)).toBe(true);
      
      if (declarator.init && t.isAwaitExpression(declarator.init)) {
        expect(t.isCallExpression(declarator.init.argument)).toBe(true);
        
        if (t.isCallExpression(declarator.init.argument)) {
          const callExpr = declarator.init.argument;
          if (t.isIdentifier(callExpr.callee)) {
            expect(callExpr.callee.name).toBe("getServerTranslation");
          }
          expect(callExpr.arguments).toHaveLength(0);
        }
      }
    });

    it("server 모드에서 다른 함수명도 올바르게 처리해야 함", () => {
      const decl = createTranslationBinding("server", "getServerT");

      const declarator = decl.declarations[0];
      expect(declarator.init).toBeDefined();
      
      if (declarator.init && t.isAwaitExpression(declarator.init)) {
        if (t.isCallExpression(declarator.init.argument)) {
          const callExpr = declarator.init.argument;
          if (t.isIdentifier(callExpr.callee)) {
            expect(callExpr.callee.name).toBe("getServerT");
          }
        }
      }
    });
  });

});
