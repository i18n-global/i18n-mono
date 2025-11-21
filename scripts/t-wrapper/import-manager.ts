/**
 * Import 관리 유틸리티
 */

import traverse from "@babel/traverse";
import * as t from "@babel/types";
import { STRING_CONSTANTS } from "./constants";


/**
 * AST에 named import가 필요한지 확인하고 추가
 * @param ast - AST 파일 노드
 * @param source - import 소스 (예: "i18nexus")
 * @param importedName - import할 이름 (예: "useTranslation")
 * @returns import가 추가되었거나 이미 존재하면 true
 */
export function ensureNamedImport(
  ast: t.File,
  source: string,
  importedName: string
): boolean {
  let hasSource = false;
  let hasSpecifier = false;

  for (const node of ast.program.body) {
    if (t.isImportDeclaration(node) && node.source.value === source) {
      hasSource = true;
      for (const spec of node.specifiers) {
        if (
          t.isImportSpecifier(spec) &&
          t.isIdentifier(spec.imported) &&
          spec.imported.name === importedName
        ) {
          hasSpecifier = true;
          break;
        }
      }
      if (!hasSpecifier) {
        node.specifiers.push(
          t.importSpecifier(
            t.identifier(importedName),
            t.identifier(importedName)
          )
        );
        hasSpecifier = true;
      }
      break;
    }
  }

  if (!hasSource) {
    const decl = t.importDeclaration(
      [
        t.importSpecifier(
          t.identifier(importedName),
          t.identifier(importedName)
        ),
      ],
      t.stringLiteral(source)
    );
    ast.program.body.unshift(decl);
    hasSpecifier = true;
  }

  return hasSpecifier;
}

/**
 * @deprecated useTranslation import 추가용 헬퍼 함수
 * ensureNamedImport를 사용하세요
 */
export function addImportIfNeeded(
  ast: t.File,
  translationImportSource: string
): boolean {
  return ensureNamedImport(
    ast,
    translationImportSource,
    STRING_CONSTANTS.USE_TRANSLATION
  );
}
