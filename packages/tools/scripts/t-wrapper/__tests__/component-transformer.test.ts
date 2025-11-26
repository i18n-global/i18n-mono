import { parse } from "@babel/parser";
import traverse, { NodePath } from "@babel/traverse";
import * as t from "@babel/types";
import { tryTransformComponent } from "../ast/component-transformer";

describe("component-transformer", () => {
  describe("tryTransformComponent", () => {
    it("React 컴포넌트를 변환해야 함", () => {
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
          const result = tryTransformComponent(path, code, modifiedComponentPaths);
          expect(result).toBe(true);
          expect(modifiedComponentPaths.length).toBe(1);
        },
      });
    });

    it("화살표 함수 형태의 React 컴포넌트를 변환해야 함", () => {
      const code = `const Component = () => {
  return <div>안녕하세요</div>;
}`;

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
            const result = tryTransformComponent(
              path,
              code,
              modifiedComponentPaths
            );
            expect(result).toBe(true);
            expect(modifiedComponentPaths.length).toBe(1);
          }
        },
      });
    });

    it("커스텀 훅을 변환해야 함", () => {
      const code = `function useCustomHook() {
  alert("테스트");
}`;

      const ast = parse(code, {
        sourceType: "module",
        plugins: ["jsx", "typescript"],
      });

      const modifiedComponentPaths: NodePath<t.Function>[] = [];

      traverse(ast, {
        FunctionDeclaration: (path) => {
          const result = tryTransformComponent(path, code, modifiedComponentPaths);
          expect(result).toBe(true);
          expect(modifiedComponentPaths.length).toBe(1);
        },
      });
    });

    it("일반 함수는 변환하지 않아야 함", () => {
      const code = `function regularFunction() {
  console.log("test");
}`;

      const ast = parse(code, {
        sourceType: "module",
        plugins: ["jsx", "typescript"],
      });

      const modifiedComponentPaths: NodePath<t.Function>[] = [];

      traverse(ast, {
        FunctionDeclaration: (path) => {
          const result = tryTransformComponent(path, code, modifiedComponentPaths);
          expect(result).toBe(false);
          expect(modifiedComponentPaths.length).toBe(0);
        },
      });
    });

    it("이름이 없는 함수는 변환하지 않아야 함", () => {
      const code = `const fn = function() {
  return <div>test</div>;
}`;

      const ast = parse(code, {
        sourceType: "module",
        plugins: ["jsx", "typescript"],
      });

      const modifiedComponentPaths: NodePath<t.Function>[] = [];

      traverse(ast, {
        FunctionExpression: (path) => {
          // FunctionExpression은 처리하지 않음
          const result = tryTransformComponent(path, code, modifiedComponentPaths);
          expect(result).toBe(false);
        },
      });
    });

    it("한국어가 없는 컴포넌트는 변환하지 않아야 함", () => {
      const code = `function Component() {
  return <div>Hello</div>;
}`;

      const ast = parse(code, {
        sourceType: "module",
        plugins: ["jsx", "typescript"],
      });

      const modifiedComponentPaths: NodePath<t.Function>[] = [];

      traverse(ast, {
        FunctionDeclaration: (path) => {
          const result = tryTransformComponent(path, code, modifiedComponentPaths);
          // 한국어가 없으면 transformFunctionBody가 wasModified: false를 반환
          expect(result).toBe(false);
          expect(modifiedComponentPaths.length).toBe(0);
        },
      });
    });
  });
});

