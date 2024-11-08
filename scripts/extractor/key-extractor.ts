/**
 * 키 추출 로직
 */

import { NodePath } from "@babel/traverse";
import * as t from "@babel/types";
import * as pathLib from "path";
import { isTFunction, getDefaultValue } from "./extractor-utils";

export interface ExtractedKey {
  key: string;
  defaultValue?: string;
  filePath?: string;
  lineNumber?: number;
  columnNumber?: number;
}

export interface ExtractorConfig {
  includeFilePaths?: boolean;
  includeLineNumbers?: boolean;
}

/**
 * t() 호출에서 번역 키 추출
 */
export function extractTranslationKey(
  path: NodePath<t.CallExpression>,
  filePath: string,
  config?: ExtractorConfig
): ExtractedKey | null {
  const { node } = path;

  // t() 함수 호출 감지
  if (!isTFunction(node.callee)) {
    return null;
  }

  const firstArg = node.arguments[0];

  // Case 1: t("문자열") - 직접 문자열
  if (t.isStringLiteral(firstArg)) {
    return createExtractedKey(
      firstArg.value,
      node,
      filePath,
      config
    );
  }

  return null;
}

/**
 * ExtractedKey 객체 생성
 */
export function createExtractedKey(
  key: string,
  node: t.CallExpression,
  filePath: string,
  config?: ExtractorConfig
): ExtractedKey {
  const loc = node.loc;

  const extractedKey: ExtractedKey = {
    key,
    defaultValue: getDefaultValue(
      node.arguments.filter(
        (arg): arg is t.Expression =>
          !t.isArgumentPlaceholder(arg) && !t.isSpreadElement(arg)
      )
    ),
  };

  if (config?.includeFilePaths) {
    extractedKey.filePath = pathLib.relative(process.cwd(), filePath);
  }

  if (config?.includeLineNumbers && loc) {
    extractedKey.lineNumber = loc.start.line;
    extractedKey.columnNumber = loc.start.column;
  }

  return extractedKey;
}

