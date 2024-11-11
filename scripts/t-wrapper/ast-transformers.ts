/**
 * AST 변환 로직
 * 문자열 리터럴, 템플릿 리터럴, JSX 텍스트를 t() 함수로 변환
 */

import { NodePath } from "@babel/traverse";
import * as t from "@babel/types";
import { hasIgnoreComment, shouldSkipPath } from "./ast-helpers";
import { STRING_CONSTANTS, REGEX_PATTERNS } from "./constants";

export interface TransformResult {
  wasModified: boolean;
}

/**
 * 함수 body 내의 AST 노드들을 변환
 */
export function transformFunctionBody(
  path: NodePath<t.Function>,
  sourceCode: string
): TransformResult {
  let wasModified = false;

  path.traverse({
    StringLiteral: (subPath) => {
      if (
        shouldSkipPath(subPath, hasIgnoreComment) ||
        hasIgnoreComment(subPath, sourceCode)
      ) {
        return;
      }

      // 빈 문자열이나 공백만 있는 문자열은 스킵
      const trimmedValue = subPath.node.value.trim();
      if (!trimmedValue) {
        return;
      }

      // 한국어 텍스트가 포함된 문자열만 처리
      if (REGEX_PATTERNS.KOREAN_TEXT.test(subPath.node.value)) {
        wasModified = true;
        const replacement = t.callExpression(
          t.identifier(STRING_CONSTANTS.TRANSLATION_FUNCTION),
          [t.stringLiteral(subPath.node.value)]
        );

        if (t.isJSXAttribute(subPath.parent)) {
          subPath.replaceWith(t.jsxExpressionContainer(replacement));
        } else {
          subPath.replaceWith(replacement);
        }
      }
    },
    TemplateLiteral: (subPath) => {
      // i18n-ignore 주석이 있는 경우 스킵
      if (
        shouldSkipPath(subPath as any, hasIgnoreComment) ||
        hasIgnoreComment(subPath, sourceCode)
      ) {
        return;
      }

      // 이미 t()로 래핑된 경우 스킵
      if (
        t.isCallExpression(subPath.parent) &&
        t.isIdentifier(subPath.parent.callee, {
          name: STRING_CONSTANTS.TRANSLATION_FUNCTION,
        })
      ) {
        return;
      }

      // 템플릿 리터럴의 모든 부분에 하나라도 한국어가 있는지 확인
      const hasKorean = subPath.node.quasis.some((quasi) =>
        REGEX_PATTERNS.KOREAN_TEXT.test(quasi.value.raw)
      );

      if (!hasKorean) {
        return;
      }

      // 템플릿 리터럴을 i18next interpolation 형식으로 변환
      // 예: `안녕 ${name}` → t(`안녕 {{name}}`, { name })
      wasModified = true;

      const templateNode = subPath.node;
      const expressions = templateNode.expressions;
      const quasis = templateNode.quasis;

      // 표현식이 없으면 단순 문자열로 처리
      if (expressions.length === 0) {
        const replacement = t.callExpression(
          t.identifier(STRING_CONSTANTS.TRANSLATION_FUNCTION),
          [t.stringLiteral(quasis[0].value.raw)]
        );
        subPath.replaceWith(replacement);
        return;
      }

      // i18next 형식으로 변환: `안녕 ${name}` → `안녕 {{name}}`
      let i18nextString = "";
      const interpolationVars: t.ObjectProperty[] = [];

      quasis.forEach((quasi, index) => {
        i18nextString += quasi.value.raw;

        if (index < expressions.length) {
          const expr = expressions[index];

          // 변수명 추출
          let varName: string;
          if (t.isIdentifier(expr)) {
            varName = expr.name;
          } else if (t.isMemberExpression(expr)) {
            // user.name → user_name
            // 간단한 멤버 표현식은 직접 변환
            const parts: string[] = [];
            let current: any = expr;
            while (t.isMemberExpression(current)) {
              if (t.isIdentifier(current.property)) {
                parts.unshift(current.property.name);
              }
              current = current.object;
            }
            if (t.isIdentifier(current)) {
              parts.unshift(current.name);
            }
            varName = parts.join(STRING_CONSTANTS.MEMBER_SEPARATOR);
          } else {
            // 복잡한 표현식은 expr0, expr1 등으로 처리
            varName = `${STRING_CONSTANTS.EXPR_PREFIX}${index}`;
          }

          // i18next 형식: {{varName}}
          i18nextString += `${STRING_CONSTANTS.INTERPOLATION_START}${varName}${STRING_CONSTANTS.INTERPOLATION_END}`;

          // interpolation 객체에 추가
          interpolationVars.push(
            t.objectProperty(t.identifier(varName), expr as t.Expression)
          );
        }
      });

      // t("안녕 {{name}}", { name: name })
      const args: Array<t.Expression | t.SpreadElement> = [
        t.stringLiteral(i18nextString),
      ];

      // interpolation 객체가 있으면 두 번째 인자로 추가
      if (interpolationVars.length > 0) {
        args.push(t.objectExpression(interpolationVars));
      }

      const replacement = t.callExpression(
        t.identifier(STRING_CONSTANTS.TRANSLATION_FUNCTION),
        args
      );
      subPath.replaceWith(replacement);
    },
    JSXText: (subPath) => {
      // i18n-ignore 주석이 있는 경우 스킵
      if (hasIgnoreComment(subPath, sourceCode)) {
        return;
      }

      const text = subPath.node.value.trim();

      // 빈 텍스트나 공백만 있는 경우 스킵
      if (!text) {
        return;
      }

      // 한국어가 포함된 텍스트만 처리
      if (REGEX_PATTERNS.KOREAN_TEXT.test(text)) {
        wasModified = true;

        // t() 함수 호출로 감싸기
        const replacement = t.jsxExpressionContainer(
          t.callExpression(t.identifier(STRING_CONSTANTS.TRANSLATION_FUNCTION), [
            t.stringLiteral(text),
          ])
        );

        subPath.replaceWith(replacement);
      }
    },
  });

  return { wasModified };
}

