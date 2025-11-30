/**
 * 타입 안전한 i18n 생성 (자동 키 추론)
 */

import React from "react";
import {
  LanguageManager,
  LanguageManagerOptions,
  LanguageConfig,
} from "./languageManager";

/** 번역 키 추출 */
export type ExtractI18nKeys<T extends Record<string, Record<string, string>>> =
  keyof T[keyof T] & string;

/** 네임스페이스별 번역 구조 */
export type NamespaceTranslations = Record<
  string,
  Record<string, Record<string, string>>
>;

/** useTranslation 반환 타입 */
export interface UseTranslationReturn<K extends string = string> {
  t: (
    key: K,
    variables?: Record<string, string | number>,
    styles?: Record<string, React.CSSProperties>,
  ) => string | React.ReactElement;
  currentLanguage: string;
  isReady: boolean;
}

/** 네임스페이스 목록 추출 */
export type ExtractNamespaces<T extends NamespaceTranslations> = keyof T &
  string;

/** 특정 네임스페이스의 키 추출 */
export type ExtractNamespaceKeys<
  T extends NamespaceTranslations,
  NS extends keyof T,
> = ExtractI18nKeys<T[NS]>;

/** 모든 네임스페이스의 키 추출 (Union) */
export type ExtractAllKeys<T extends NamespaceTranslations> = {
  [K in keyof T]: ExtractNamespaceKeys<T, K>;
}[keyof T];

/** Fallback 네임스페이스 키 추출 */
export type ExtractFallbackKeys<
  T extends NamespaceTranslations,
  Fallback extends keyof T,
> = ExtractNamespaceKeys<T, Fallback>;

/** 네임스페이스 + Fallback 키 추출 */
export type ExtractNamespaceWithFallback<
  T extends NamespaceTranslations,
  NS extends keyof T,
  Fallback extends keyof T,
> = ExtractNamespaceKeys<T, NS> | ExtractFallbackKeys<T, Fallback>;

/** Lazy loading용 네임스페이스 로더 타입 */
export type NamespaceLoader = (
  namespace: string,
  language: string,
) => Promise<Record<string, string>>;

/** createI18n 옵션 */
export interface CreateI18nOptions<
  TTranslations extends NamespaceTranslations,
  Fallback extends keyof TTranslations = keyof TTranslations,
> {
  /** 네임스페이스 미지정 시 사용할 fallback */
  fallbackNamespace?: Fallback;
  /** Fallback 활성화 (기본: true) */
  enableFallback?: boolean;
  /** Lazy loading 활성화 (기본: false) */
  lazy?: boolean;
  /** Lazy loading용 네임스페이스 로더 (lazy: true일 때 필수) */
  loadNamespace?: NamespaceLoader;
  /** 초기화 시 미리 로드할 네임스페이스 (lazy 모드만) */
  preloadNamespaces?: Array<keyof TTranslations>;
  /** 언어 관리자 설정 */
  languageManager?: LanguageManagerOptions;
}

/**
 * 타입 안전한 i18n 시스템 생성
 * @param translations - 네임스페이스별 번역 객체
 * @param options - Fallback 네임스페이스 및 언어 관리자 설정
 */
export function createI18n<
  TTranslations extends NamespaceTranslations,
  Fallback extends keyof TTranslations = keyof TTranslations,
>(
  translations: TTranslations,
  options?: CreateI18nOptions<TTranslations, Fallback>,
) {
  const fallbackNamespace = options?.fallbackNamespace;
  const enableFallback = options?.enableFallback !== false;
  const lazy = options?.lazy ?? false;
  const loadNamespace = options?.loadNamespace;
  const preloadNamespaces = options?.preloadNamespaces ?? [];

  if (lazy && !loadNamespace) {
    throw new Error(
      "createI18n: lazy 모드에서는 loadNamespace 함수가 필요합니다",
    );
  }

  const languageManager = new LanguageManager(options?.languageManager);
  let currentLanguage: string | null = null;
  const languageListeners = new Set<(language: string) => void>();

  function getCurrentLanguage(): string {
    if (typeof window === "undefined") {
      return languageManager.getDefaultLanguage();
    }
    if (currentLanguage === null) {
      currentLanguage = languageManager.getCurrentLanguage();
    }
    return currentLanguage;
  }

  // Lazy 모드용 네임스페이스 캐시
  const loadedNamespaces = new Map<
    string,
    Record<string, Record<string, string>>
  >();

  // 프리로드 네임스페이스 (lazy 모드에서만)
  if (lazy && loadNamespace && preloadNamespaces.length > 0) {
    Promise.all(
      preloadNamespaces.map(async (ns) => {
        const languages = Object.keys(translations[ns] || {});
        const promises = languages.map(async (lang) => {
          const data = await loadNamespace(String(ns), lang);
          return { lang, data };
        });

        const results = await Promise.all(promises);
        const nsData: Record<string, Record<string, string>> = {};
        results.forEach(({ lang, data }) => {
          nsData[lang] = data;
        });

        loadedNamespaces.set(String(ns), nsData);
      }),
    ).catch((error) => {
      console.error("Failed to preload namespaces:", error);
    });
  }

  // 문자열 보간 함수
  function interpolate(
    text: string,
    variables?: Record<string, string | number>,
  ): string {
    if (!variables) {
      return text;
    }

    return text.replace(/\{\{(\w+)\}\}/g, (match, variableName) => {
      const value = variables[variableName];
      return value !== undefined ? String(value) : match;
    });
  }

  function interpolateWithStyles(
    text: string,
    variables: Record<string, string | number>,
    styles: Record<string, React.CSSProperties>,
  ): React.ReactElement {
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
  }

  // 현재 언어의 번역을 평탄화
  function getFlattenedTranslations(language: string): Record<string, string> {
    const flattened: Record<string, string> = {};

    if (lazy) {
      loadedNamespaces.forEach((nsData) => {
        if (nsData[language]) {
          Object.assign(flattened, nsData[language]);
        }
      });
    } else {
      Object.keys(translations).forEach((ns) => {
        const nsData = translations[ns];
        if (nsData && nsData[language]) {
          Object.assign(flattened, nsData[language]);
        }
      });
    }

    return flattened;
  }

  /**
   * 타입 안전한 useTranslation 훅 (Provider 불필요)
   * 언어 변경을 자동으로 구독하고 번역 함수 제공
   * @param namespace - 네임스페이스 (미지정 시 모든 키 접근)
   */
  function useTranslation<
    NS extends ExtractNamespaces<TTranslations> | undefined = undefined,
  >(
    namespace?: NS,
  ): UseTranslationReturn<
    NS extends undefined
      ? ExtractAllKeys<TTranslations>
      : Fallback extends keyof TTranslations
        ? ExtractNamespaceWithFallback<TTranslations, NonNullable<NS>, Fallback>
        : ExtractNamespaceKeys<TTranslations, NonNullable<NS>>
  > {
    const [language, setLanguage] = React.useState<string>(() =>
      getCurrentLanguage(),
    );

    React.useEffect(() => {
      const current = getCurrentLanguage();
      if (current !== language) {
        setLanguage(current);
      }

      const unsubscribe = languageManager.addLanguageChangeListener(
        (newLang) => {
          currentLanguage = newLang;
          setLanguage(newLang);
          languageListeners.forEach((listener) => {
            try {
              listener(newLang);
            } catch (error) {
              console.error("Error in language listener:", error);
            }
          });
        },
      );

      return unsubscribe;
    }, []);

    const flattenedTranslations = React.useMemo(
      () => getFlattenedTranslations(language),
      [language],
    );

    const translate = React.useCallback(
      (
        key: any,
        variables?: Record<string, string | number>,
        styles?: Record<string, React.CSSProperties>,
      ): any => {
        const text = flattenedTranslations[key] || key;

        if (styles && variables) {
          return interpolateWithStyles(text, variables, styles);
        }

        return interpolate(text, variables);
      },
      [flattenedTranslations],
    );

    return {
      t: translate as any,
      currentLanguage: language,
      isReady: true,
    };
  }

  /**
   * 서버 컴포넌트용 번역 함수 (Next.js)
   * 헤더에서 언어를 자동 감지하여 타입 안전한 번역 함수 반환
   * @param namespace - 네임스페이스 (미지정 시 모든 키 사용)
   */
  async function getServerTranslation<
    NS extends ExtractNamespaces<TTranslations> | undefined = undefined,
  >(namespace?: NS) {
    let headersList: Headers;
    try {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const { headers } = await import("next/headers");
      headersList = await headers();
    } catch {
      headersList = new Headers();
    }

    let language = "en";
    try {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const { getServerLanguage } = await import("./server");
      language = getServerLanguage(headersList);
    } catch {
      const cookieHeader = headersList.get("cookie");
      if (cookieHeader) {
        const cookies = cookieHeader.split(";");
        for (const cookie of cookies) {
          const [name, value] = cookie.trim().split("=");
          if (decodeURIComponent(name) === "i18n-language") {
            language = decodeURIComponent(value);
            break;
          }
        }
      }
    }

    const flattenedTranslations: Record<string, string> = {};

    if (namespace) {
      const nsData = translations[namespace];
      const fallbackData = fallbackNamespace
        ? translations[fallbackNamespace]
        : null;

      if (nsData && nsData[language]) {
        Object.assign(flattenedTranslations, nsData[language]);
      }
      if (
        enableFallback &&
        fallbackData &&
        fallbackData[language] &&
        namespace !== (fallbackNamespace as any)
      ) {
        Object.assign(flattenedTranslations, fallbackData[language]);
      }
    } else {
      Object.keys(translations).forEach((ns) => {
        const nsData = translations[ns];
        if (nsData && nsData[language]) {
          Object.assign(flattenedTranslations, nsData[language]);
        }
      });
    }

    function t(
      key: NS extends undefined
        ? ExtractAllKeys<TTranslations>
        : Fallback extends keyof TTranslations
          ? ExtractNamespaceWithFallback<
              TTranslations,
              NonNullable<NS>,
              Fallback
            >
          : ExtractNamespaceKeys<TTranslations, NonNullable<NS>>,
      variables?: Record<string, string | number>,
    ): string {
      const text = flattenedTranslations[key as string] || (key as string);

      if (!variables) {
        return text;
      }

      return text.replace(/\{\{(\w+)\}\}/g, (match, variableName) => {
        const value = variables[variableName];
        return value !== undefined ? String(value) : match;
      });
    }

    return {
      t,
      language,
      translations: flattenedTranslations,
    };
  }

  return {
    useTranslation,
    getServerTranslation,

    /** 언어 변경 */
    changeLanguage: async (lang: string): Promise<void> => {
      if (typeof window === "undefined") {
        console.warn("changeLanguage()는 클라이언트에서만 사용 가능합니다");
        return;
      }

      const success = languageManager.setLanguage(lang);
      if (success) {
        currentLanguage = lang;
      }
    },

    getCurrentLanguage,
    getAvailableLanguages: (): LanguageConfig[] => {
      return languageManager.getAvailableLanguages();
    },
    getLanguageConfig: (code: string): LanguageConfig | undefined => {
      return languageManager.getLanguageConfig(code);
    },

    /** 브라우저 언어 감지 (서버에서는 null) */
    detectBrowserLanguage: (): string | null => {
      if (typeof window === "undefined") {
        return null;
      }
      return languageManager.detectBrowserLanguage();
    },

    /** 언어를 기본값으로 리셋 (서버에서는 no-op) */
    resetLanguage: (): void => {
      if (typeof window === "undefined") {
        return;
      }
      languageManager.reset();
      currentLanguage = null;
    },

    translations,
    options: {
      fallbackNamespace,
      enableFallback,
      lazy,
      preloadNamespaces,
    },

    /** 네임스페이스 동적 로드 (lazy 모드만) */
    loadNamespace: async (namespace: keyof TTranslations) => {
      if (!lazy) {
        console.warn("loadNamespace()는 lazy 모드에서만 사용 가능합니다");
        return;
      }
      if (!loadNamespace) {
        throw new Error("loadNamespace 함수가 설정되지 않았습니다");
      }

      if (loadedNamespaces.has(namespace as string)) {
        return;
      }

      const languages = Object.keys(translations[namespace] || {});
      const promises = languages.map(async (lang) => {
        const data = await loadNamespace(namespace as string, lang);
        return { lang, data };
      });

      const results = await Promise.all(promises);
      const nsData: Record<string, Record<string, string>> = {};
      results.forEach(({ lang, data }) => {
        nsData[lang] = data;
      });

      loadedNamespaces.set(namespace as string, nsData);
    },
  };
}

/** createI18n 반환 타입 추론 헬퍼 */
export type CreateI18nReturn<T extends NamespaceTranslations> = ReturnType<
  typeof createI18n<T>
>;
