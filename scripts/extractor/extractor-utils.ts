/**
 * Extractor 유틸리티 함수들
 * 순수 함수로 구성되어 테스트하기 쉬움
 */

import * as t from "@babel/types";

/**
 * t() 함수 호출인지 확인
 */
export function isTFunction(
  callee: t.Expression | t.V8IntrinsicIdentifier
): boolean {
  // t() 직접 호출
  if (t.isIdentifier(callee, { name: "t" })) {
    return true;
  }

  // useTranslation().t 형태의 호출
  if (
    t.isMemberExpression(callee) &&
    t.isIdentifier(callee.property, { name: "t" })
  ) {
    return true;
  }

  return false;
}

/**
 * t() 함수 호출에서 defaultValue 추출
 */
export function getDefaultValue(args: t.Expression[]): string | undefined {
  // 두 번째 인수가 옵션 객체인 경우 defaultValue 추출
  if (args.length > 1 && t.isObjectExpression(args[1])) {
    const defaultValueProp = args[1].properties.find(
      (prop) =>
        t.isObjectProperty(prop) &&
        t.isIdentifier(prop.key, { name: "defaultValue" }) &&
        t.isStringLiteral(prop.value)
    );

    if (defaultValueProp && t.isObjectProperty(defaultValueProp)) {
      return (defaultValueProp.value as t.StringLiteral).value;
    }
  }

  return undefined;
}

/**
 * CSV 값 이스케이프 처리
 */
export function escapeCsvValue(value: string): string {
  // CSV에서 특수 문자가 포함된 경우 따옴표로 감싸고, 따옴표는 두 번 반복
  if (
    value.includes(",") ||
    value.includes('"') ||
    value.includes("\n") ||
    value.includes("\r")
  ) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

