/**
 * Import 관리 유틸리티
 */

import traverse from "@babel/traverse";
import * as t from "@babel/types";
import { STRING_CONSTANTS } from "./constants";

/**
 * useTranslation 훅을 생성하는 AST 노드 생성
 */
export function createUseTranslationHook(): t.VariableDeclaration {
  // useTranslation()을 빈 값으로 호출 - 내부적으로 현재 언어 자동 주입
  const hookCall = t.callExpression(
    t.identifier(STRING_CONSTANTS.USE_TRANSLATION),
    []
  );

  return t.variableDeclaration(STRING_CONSTANTS.VARIABLE_KIND, [
    t.variableDeclarator(
      t.objectPattern([
        t.objectProperty(
          t.identifier(STRING_CONSTANTS.TRANSLATION_FUNCTION),
          t.identifier(STRING_CONSTANTS.TRANSLATION_FUNCTION),
          false,
          true
        ),
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
            spec.imported.name === STRING_CONSTANTS.USE_TRANSLATION
        );

        if (!hasUseTranslation) {
          path.node.specifiers.push(
            t.importSpecifier(
              t.identifier(STRING_CONSTANTS.USE_TRANSLATION),
              t.identifier(STRING_CONSTANTS.USE_TRANSLATION)
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
          t.identifier(STRING_CONSTANTS.USE_TRANSLATION),
          t.identifier(STRING_CONSTANTS.USE_TRANSLATION)
        ),
      ],
      t.stringLiteral(translationImportSource)
    );
    ast.program.body.unshift(importDeclaration);
    return true;
  }

  return false;
}

