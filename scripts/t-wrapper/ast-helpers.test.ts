/**
 * ast-helpers 테스트
 * 순수 함수들 테스트
 */

import {
  hasIgnoreComment,
  shouldSkipPath,
  isReactComponent,
} from "./ast-helpers";
import { parse } from "@babel/parser";
import traverse from "@babel/traverse";

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

    it("use로 시작하는 훅은 컴포넌트로 인식해야 함", () => {
      expect(isReactComponent("useState")).toBe(true);
      expect(isReactComponent("useTranslation")).toBe(true);
    });
  });
});
