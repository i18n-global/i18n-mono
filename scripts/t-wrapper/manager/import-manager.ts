/**
 * Import 및 디렉티브 관리 유틸리티
 */

import traverse from "@babel/traverse";
import * as t from "@babel/types";
import { STRING_CONSTANTS } from "../utils/constants";

/** AST에 named import가 필요한지 확인하고 추가 */
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

/** AST에 "use client" 디렉티브가 필요한지 확인하고 추가 */
export function ensureUseClientDirective(ast: t.File): boolean {
  // 이미 존재하면 패스
  const hasDirective = (ast.program.directives || []).some(
    (d) => d.value.value === STRING_CONSTANTS.USE_CLIENT_DIRECTIVE
  );
  if (!hasDirective) {
    const dir = t.directive(
      t.directiveLiteral(STRING_CONSTANTS.USE_CLIENT_DIRECTIVE)
    );
    ast.program.directives = ast.program.directives || [];
    ast.program.directives.unshift(dir);
    return true;
  }
  return false;
}
