/**
 * AST 헬퍼 함수들
 * 순수 함수로 구성되어 테스트하기 쉬움
 */

import { NodePath } from "@babel/traverse";
import * as t from "@babel/types";
import { STRING_CONSTANTS, REGEX_PATTERNS } from "../utils/constants";

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
        comment.value.trim().startsWith(STRING_CONSTANTS.I18N_IGNORE),
    );
    if (hasIgnore) return true;
  }

  // 2. 부모 노드의 leadingComments 확인
  if (path.parentPath?.node?.leadingComments) {
    const hasIgnore = path.parentPath.node.leadingComments.some(
      (comment) =>
        comment.value.trim() === STRING_CONSTANTS.I18N_IGNORE ||
        comment.value.trim().startsWith(STRING_CONSTANTS.I18N_IGNORE),
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
  hasIgnoreCommentFn: (path: NodePath, sourceCode?: string) => boolean,
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
 * 대문자로 시작하는 함수명 (예: Component, MyButton)
 */
export function isReactComponent(name: string): boolean {
  return REGEX_PATTERNS.REACT_COMPONENT.test(name);
}

/**
 * React 커스텀 훅 이름인지 확인
 * use로 시작하고 대문자로 이어지는 함수명 (예: useMyHook, useToast)
 */
export function isReactCustomHook(name: string): boolean {
  return REGEX_PATTERNS.REACT_HOOK.test(name);
}

/** 함수 본문(body)에 이미 번역 함수 호출이 있는지 확인 */
export function hasTranslationFunctionCall(
  body: NodePath<t.BlockStatement | t.Expression>,
  functionName: string,
): boolean {
  if (!body.isBlockStatement()) {
    return false;
  }

  let hasCall = false;
  body.traverse({
    CallExpression: (p) => {
      if (
        t.isIdentifier(p.node.callee, {
          name: functionName,
        })
      ) {
        hasCall = true;
      }
    },
  });

  return hasCall;
}

/**
 * 번역 함수 바인딩 생성 (공통 함수)
 * client 모드: const { t } = useTranslation()
 * server 모드: const { t } = await getServerTranslation()
 */
export function createTranslationBinding(
  mode: "client" | "server",
  serverFnName?: string,
): t.VariableDeclaration {
  const pattern = t.objectPattern([
    t.objectProperty(
      t.identifier(STRING_CONSTANTS.TRANSLATION_FUNCTION),
      t.identifier(STRING_CONSTANTS.TRANSLATION_FUNCTION),
      false,
      true,
    ),
  ]);

  let callExpression: t.Expression;
  if (mode === "server") {
    // 서버 모드: await getServerTranslation()
    const fnName = serverFnName || STRING_CONSTANTS.GET_SERVER_TRANSLATION;
    callExpression = t.awaitExpression(
      t.callExpression(t.identifier(fnName), []),
    );
  } else {
    // 클라이언트 모드: useTranslation()
    callExpression = t.callExpression(
      t.identifier(STRING_CONSTANTS.USE_TRANSLATION),
      [],
    );
  }

  return t.variableDeclaration(STRING_CONSTANTS.VARIABLE_KIND, [
    t.variableDeclarator(pattern, callExpression),
  ]);
}
