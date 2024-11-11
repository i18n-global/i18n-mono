/**
 * AST 헬퍼 함수들
 * 순수 함수로 구성되어 테스트하기 쉬움
 */

import { NodePath } from "@babel/traverse";
import * as t from "@babel/types";
import { STRING_CONSTANTS, REGEX_PATTERNS } from "./constants";

/**
 * i18n-ignore 주석이 노드 바로 위에 있는지 확인
 * 파일의 원본 소스코드를 직접 검사하여 주석 감지
 */
export function hasIgnoreComment(path: NodePath, sourceCode?: string): boolean {
  const node = path.node;

  // 1. AST의 leadingComments 확인
  if (node.leadingComments) {
    const hasIgnore = node.leadingComments.some(
      (comment) =>
        comment.value.trim() === STRING_CONSTANTS.I18N_IGNORE ||
        comment.value.trim().startsWith(STRING_CONSTANTS.I18N_IGNORE)
    );
    if (hasIgnore) return true;
  }

  // 2. 부모 노드의 leadingComments 확인
  if (path.parentPath?.node?.leadingComments) {
    const hasIgnore = path.parentPath.node.leadingComments.some(
      (comment) =>
        comment.value.trim() === STRING_CONSTANTS.I18N_IGNORE ||
        comment.value.trim().startsWith(STRING_CONSTANTS.I18N_IGNORE)
    );
    if (hasIgnore) return true;
  }

  // 3. 소스코드 직접 검사 (node.loc가 있는 경우)
  if (sourceCode && node.loc) {
    const startLine = node.loc.start.line;
    const lines = sourceCode.split("\n");

    // 현재 라인과 바로 위 라인 검사
    for (let i = Math.max(0, startLine - 3); i < startLine; i++) {
      const line = lines[i];
      if (
        line &&
        (line.includes(STRING_CONSTANTS.I18N_IGNORE) ||
          line.includes(STRING_CONSTANTS.I18N_IGNORE_COMMENT) ||
          line.includes(STRING_CONSTANTS.I18N_IGNORE_BLOCK) ||
          line.includes(STRING_CONSTANTS.I18N_IGNORE_JSX))
      ) {
        return true;
      }
    }
  }

  return false;
}

/**
 * 문자열 리터럴 경로를 스킵해야 하는지 확인
 */
export function shouldSkipPath(
  path: NodePath<t.StringLiteral>,
  hasIgnoreCommentFn: (path: NodePath, sourceCode?: string) => boolean
): boolean {
  // i18n-ignore 주석이 있는 경우 스킵
  if (hasIgnoreCommentFn(path)) {
    return true;
  }

  // 부모 노드에 i18n-ignore 주석이 있는 경우도 스킵
  if (path.parent && hasIgnoreCommentFn(path.parentPath as NodePath)) {
    return true;
  }

  // t() 함수로 이미 래핑된 경우 스킵
  if (
    t.isCallExpression(path.parent) &&
    t.isIdentifier(path.parent.callee, {
      name: STRING_CONSTANTS.TRANSLATION_FUNCTION,
    })
  ) {
    return true;
  }

  // import 구문은 스킵
  const importParent = path.findParent((p) => t.isImportDeclaration(p.node));
  if (importParent?.node && t.isImportDeclaration(importParent.node)) {
    return true;
  }

  // 객체 프로퍼티 KEY면 무조건 스킵
  if (t.isObjectProperty(path.parent) && path.parent.key === path.node) {
    return true;
  }

  return false;
}

/**
 * React 컴포넌트 이름인지 확인
 */
export function isReactComponent(name: string): boolean {
  return (
    REGEX_PATTERNS.REACT_COMPONENT.test(name) ||
    REGEX_PATTERNS.REACT_HOOK.test(name)
  );
}

/**
 * 함수가 getServerTranslation으로 감싸진 서버 컴포넌트인지 확인
 */
export function isServerComponent(path: NodePath<t.Function>): boolean {
  // 함수 body 내에서 getServerTranslation 호출이 있는지 확인
  let hasServerTranslation = false;

  path.traverse({
    CallExpression: (callPath) => {
      if (
        t.isIdentifier(callPath.node.callee, {
          name: STRING_CONSTANTS.GET_SERVER_TRANSLATION,
        }) ||
        (t.isAwaitExpression(callPath.parent) &&
          t.isCallExpression(callPath.node) &&
          t.isIdentifier(callPath.node.callee, {
            name: STRING_CONSTANTS.GET_SERVER_TRANSLATION,
          }))
      ) {
        hasServerTranslation = true;
        callPath.stop(); // 찾았으면 더 이상 탐색하지 않음
      }
    },
  });

  return hasServerTranslation;
}
