"use client";

import React from "react";
import {
  useI18nContext,
  NamespaceTranslations,
  ExtractNamespaceKeys,
  ExtractKeysWithFallback,
} from "../components/I18nProvider";
import type { LanguageConfig } from "../utils/languageManager";

/** 문자열 보간 변수 */
export type TranslationVariables = Record<string, string | number>;

/** 변수 스타일 설정 */
export type VariableStyle = React.CSSProperties;

/** 번역 변수 스타일 */
export type TranslationStyles = Record<string, VariableStyle>;

/** 타입 안전한 번역 함수 오버로드 */
export interface TranslationFunction<K extends string = string> {
  /** 스타일 포함 번역 (React 요소 반환) */
  (
    key: K,
    variables: TranslationVariables,
    styles: TranslationStyles,
  ): React.ReactElement;

  /** 스타일 없는 번역 (문자열 반환) */
  (key: K, variables?: TranslationVariables): string;
}

/** useTranslation 훅 반환 타입 */
export interface UseTranslationReturn<K extends string = string> {
  /** 타입 가드가 있는 번역 함수 (스타일 제공 시 React 요소, 없으면 문자열) */
  t: TranslationFunction<K>;
  /** 현재 언어 코드 */
  currentLanguage: string;
  /** 번역 준비 여부 */
  isReady: boolean;
}

/** 번역 문자열의 변수 치환 */
const interpolate = (
  text: string,
  variables?: TranslationVariables,
): string => {
  if (!variables) {
    return text;
  }

  return text.replace(/\{\{(\w+)\}\}/g, (match, variableName) => {
    const value = variables[variableName];
    return value !== undefined ? String(value) : match;
  });
};

/** 스타일이 적용된 React 요소로 변수 치환 */
const interpolateWithStyles = (
  text: string,
  variables: TranslationVariables,
  styles: TranslationStyles,
): React.ReactElement => {
  const parts: (string | React.ReactElement)[] = [];
  let lastIndex = 0;
  const regex = /\{\{(\w+)\}\}/g;
  let match;
  let key = 0;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }

    const variableName = match[1];
    const value = variables[variableName];
    const style = styles[variableName];

    if (value !== undefined) {
      if (style) {
        parts.push(
          React.createElement(
            "span",
            { key: `var-${key++}`, style: style },
            String(value),
          ),
        );
      } else {
        parts.push(String(value));
      }
    } else {
      parts.push(match[0]);
    }

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return React.createElement(React.Fragment, null, ...parts);
};

/** 번역 함수 및 현재 언어 접근 훅 (오버로드) */
// 오버로드 1: 타입 명시 없이 사용 (기본 동작, 하위 호환성)
export function useTranslation<K extends string = string>(
  namespace?: string,
): UseTranslationReturn<K>;

// 오버로드 2: Context에서 타입 자동 추론 (v3.1 신기능)
export function useTranslation<
  TTranslations extends NamespaceTranslations,
  NS extends keyof TTranslations & string,
  Fallback extends keyof TTranslations & string = never,
>(
  namespace: NS,
): UseTranslationReturn<
  [Fallback] extends [never]
    ? ExtractNamespaceKeys<TTranslations, NS>
    : ExtractKeysWithFallback<TTranslations, NS, Fallback>
>;

// 실제 구현
export function useTranslation(namespace?: string): UseTranslationReturn<any> {
  const context = useI18nContext();
  const { currentLanguage, isLoading, loadedNamespaces, fallbackNamespace } =
    context;

  // 번역 데이터 가져오기 (I18nProvider에서 로드된 데이터만 사용)
  const getCurrentTranslations = (): Record<string, string> => {
    let result: Record<string, string> = {};

    // Fallback namespace 먼저 로드
    if (fallbackNamespace) {
      const fallbackNs = loadedNamespaces.get(String(fallbackNamespace))?.[
        currentLanguage
      ];
      if (fallbackNs) {
        result = { ...fallbackNs };
      }
    }

    // 요청된 namespace 로드 (fallback 덮어쓰기)
    if (namespace) {
      const requestedNs = loadedNamespaces.get(namespace)?.[currentLanguage];
      if (requestedNs) {
        result = { ...result, ...requestedNs };
      }
    }

    return result;
  };

  const currentTranslations = getCurrentTranslations();

  const translate = ((
    key: any,
    variables?: TranslationVariables,
    styles?: TranslationStyles,
  ): string | React.ReactElement => {
    const translatedText = currentTranslations[key] || key;

    if (styles && variables) {
      return interpolateWithStyles(translatedText, variables, styles);
    }

    return interpolate(translatedText, variables);
  }) as TranslationFunction<any>;

  // 네임스페이스가 로드되었는지 확인
  const isNamespaceReady = namespace ? loadedNamespaces.has(namespace) : true;

  return {
    t: translate,
    currentLanguage,
    isReady: !isLoading && isNamespaceReady,
  };
}

/** useLanguageSwitcher 훅 반환 타입 */
export interface UseLanguageSwitcherReturn {
  /** 현재 언어 코드 */
  currentLanguage: string;
  /** 사용 가능한 언어 설정 목록 */
  availableLanguages: LanguageConfig[];
  /** 언어 변경 */
  changeLanguage: (lang: string) => Promise<void>;
  /** changeLanguage 별칭 */
  switchLng: (lang: string) => Promise<void>;
  /** 다음 언어로 전환 */
  switchToNextLanguage: () => Promise<void>;
  /** 이전 언어로 전환 */
  switchToPreviousLanguage: () => Promise<void>;
  /** 언어 설정 조회 */
  getLanguageConfig: (code?: string) => LanguageConfig | undefined;
  /** 브라우저 언어 감지 */
  detectBrowserLanguage: () => string | null;
  /** 기본 언어로 리셋 */
  resetLanguage: () => void;
  /** 언어 변경 중 여부 */
  isLoading: boolean;
}

/** 언어 전환 기능 접근 훅 */
export const useLanguageSwitcher = (): UseLanguageSwitcherReturn => {
  const {
    currentLanguage,
    changeLanguage,
    availableLanguages,
    languageManager,
    isLoading,
  } = useI18nContext();

  const switchToNextLanguage = async () => {
    const languageCodes = availableLanguages.map((lang) => lang.code);
    const currentIndex = languageCodes.indexOf(currentLanguage);
    const nextIndex = (currentIndex + 1) % languageCodes.length;
    const nextLanguage = languageCodes[nextIndex];
    await changeLanguage(nextLanguage);
  };

  const switchToPreviousLanguage = async () => {
    const languageCodes = availableLanguages.map((lang) => lang.code);
    const currentIndex = languageCodes.indexOf(currentLanguage);
    const prevIndex =
      currentIndex === 0 ? languageCodes.length - 1 : currentIndex - 1;
    const prevLanguage = languageCodes[prevIndex];
    await changeLanguage(prevLanguage);
  };

  const getLanguageConfig = (code?: string) => {
    return languageManager.getLanguageConfig(code || currentLanguage);
  };

  const detectBrowserLanguage = () => {
    return languageManager.detectBrowserLanguage();
  };

  const resetLanguage = () => {
    languageManager.reset();
  };

  return {
    currentLanguage,
    availableLanguages,
    changeLanguage,
    switchLng: changeLanguage,
    switchToNextLanguage,
    switchToPreviousLanguage,
    getLanguageConfig,
    detectBrowserLanguage,
    resetLanguage,
    isLoading,
  };
};
