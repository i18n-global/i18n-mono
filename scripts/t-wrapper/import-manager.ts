/**
 * Import 관리 유틸리티
 */

import traverse from "@babel/traverse";
import * as t from "@babel/types";

/**
 * useTranslation 훅을 생성하는 AST 노드 생성
 */
export function createUseTranslationHook(): t.VariableDeclaration {
  // useTranslation()을 빈 값으로 호출 - 내부적으로 현재 언어 자동 주입
  const hookCall = t.callExpression(t.identifier("useTranslation"), []);

  return t.variableDeclaration("const", [
    t.variableDeclarator(
      t.objectPattern([
        t.objectProperty(t.identifier("t"), t.identifier("t"), false, true),
      ]),
      hookCall
    ),
  ]);
}

/**
 * AST에 useTranslation import가 필요한지 확인하고 추가
 */
export function addImportIfNeeded(
  ast: t.File,
  translationImportSource: string
): boolean {
  let hasImport = false;

  traverse(ast, {
    ImportDeclaration: (path) => {
      if (path.node.source.value === translationImportSource) {
        const hasUseTranslation = path.node.specifiers.some(
          (spec) =>
            t.isImportSpecifier(spec) &&
            t.isIdentifier(spec.imported) &&
            spec.imported.name === "useTranslation"
        );

        if (!hasUseTranslation) {
          path.node.specifiers.push(
            t.importSpecifier(
              t.identifier("useTranslation"),
              t.identifier("useTranslation")
            )
          );
        }
        hasImport = true;
      }
    },
  });

  if (!hasImport) {
    const importDeclaration = t.importDeclaration(
      [
        t.importSpecifier(
          t.identifier("useTranslation"),
          t.identifier("useTranslation")
        ),
      ],
      t.stringLiteral(translationImportSource)
    );
    ast.program.body.unshift(importDeclaration);
    return true;
  }

  return false;
}

