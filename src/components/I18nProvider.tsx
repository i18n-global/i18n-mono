"use client";

import React, { ReactNode } from "react";
import {
  LanguageManager,
  LanguageConfig,
  LanguageManagerOptions,
} from "../utils/languageManager";

/**
 * Extract translation keys from a namespace's translations
 * @example
 * type Keys = ExtractI18nKeys<typeof translations["common"]>;
 * // "greeting" | "farewell" | "welcome"
 */
export type ExtractI18nKeys<T extends Record<string, Record<string, string>>> =
  keyof T[keyof T] & string;

/**
 * Namespace-based translation structure
 * @example
 * {
 *   common: { en: { welcome: "Welcome" }, ko: { welcome: "환영합니다" } },
 *   menu: { en: { home: "Home" }, ko: { home: "홈" } },
 *   dynamic: { en: { ... }, ko: { ... } }
 * }
 */
export type NamespaceTranslations = Record<
  string,
  Record<string, Record<string, string>>
>;

export interface I18nContextType<
  TLanguage extends string = string,
  TKeys extends string = string,
> {
  currentLanguage: TLanguage;
  changeLanguage: (lang: TLanguage) => Promise<void>;
  availableLanguages: LanguageConfig[];
  languageManager: LanguageManager;
  isLoading: boolean;
  /**
   * Namespace-based translations
   * @example
   * {
   *   common: { en: { welcome: "Welcome" }, ko: { welcome: "환영합니다" } },
   *   menu: { en: { home: "Home" }, ko: { home: "홈" } }
   * }
   */
  translations: NamespaceTranslations;
  /**
   * Dynamic translations (separate from static namespaces)
   */
  dynamicTranslations: Record<string, Record<string, string>>;
  /**
   * Valid translation keys extracted from translations
   * This is used for type-safe useTranslation
   */
  _translationKeys?: Record<TKeys, true>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const I18nContext = React.createContext<I18nContextType<
  any,
  any
> | null>(null);

export const useI18nContext = <
  TLanguage extends string = string,
  TKeys extends string = string,
>(): I18nContextType<TLanguage, TKeys> => {
  const context = React.useContext(I18nContext);
  if (!context) {
    throw new Error("useI18nContext must be used within an I18nProvider");
  }
  return context as unknown as I18nContextType<TLanguage, TKeys>;
};

export interface I18nProviderProps<
  TLanguage extends string = string,
  TTranslations extends NamespaceTranslations = NamespaceTranslations,
> {
  children: ReactNode;
  languageManagerOptions?: LanguageManagerOptions;
  /**
   * Namespace-based translations
   * @example
   * {
   *   common: { en: { welcome: "Welcome" }, ko: { welcome: "환영합니다" } },
   *   menu: { en: { home: "Home" }, ko: { home: "홈" } }
   * }
   */
  translations?: TTranslations;
  /**
   * Dynamic translations (optional, separate from static namespaces)
   * @example
   * {
   *   en: { "item.type.0": "League", "error.404": "Not Found" },
   *   ko: { "item.type.0": "리그", "error.404": "찾을 수 없음" }
   * }
   */
  dynamicTranslations?: Record<string, Record<string, string>>;
  onLanguageChange?: (language: TLanguage) => void;
  /**
   * Initial language from server-side (for SSR/Next.js App Router)
   * This prevents hydration mismatch by ensuring server and client render with the same language
   */
  initialLanguage?: TLanguage;
}

export function I18nProvider<
  TLanguage extends string = string,
  TTranslations extends NamespaceTranslations = NamespaceTranslations,
>({
  children,
  languageManagerOptions,
  translations,
  dynamicTranslations,
  onLanguageChange,
  initialLanguage,
}: I18nProviderProps<TLanguage, TTranslations>) {
  const defaultTranslations = translations || ({} as TTranslations);
  const defaultDynamicTranslations = dynamicTranslations || {};
  const [languageManager] = React.useState(
    () => new LanguageManager(languageManagerOptions),
  );

  // Use initialLanguage (from server) if provided, otherwise use default
  // This prevents hydration mismatch
  const getInitialLanguage = () => {
    if (initialLanguage) {
      return initialLanguage;
    }
    return languageManagerOptions?.defaultLanguage || "en";
  };

  const [currentLanguage, setCurrentLanguage] = React.useState<TLanguage>(
    getInitialLanguage() as TLanguage,
  );
  const [isLoading, setIsLoading] = React.useState(false);
  const [isHydrated, setIsHydrated] = React.useState(false);

  const changeLanguage = async (lang: TLanguage): Promise<void> => {
    if (lang === currentLanguage) {
      return;
    }

    setIsLoading(true);
    try {
      // LanguageManager를 통해 언어 설정
      const success = languageManager.setLanguage(lang);
      if (!success) {
        throw new Error(`Failed to set language to ${lang}`);
      }

      // i18nexus 자체 언어 관리

      setCurrentLanguage(lang);

      // 콜백 호출
      onLanguageChange?.(lang);
    } catch (error) {
      console.error("Failed to change language:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // 클라이언트에서 hydration 완료 후 실제 언어 설정 로드
  React.useEffect(() => {
    setIsHydrated(true);

    // initialLanguage가 제공되지 않은 경우에만 쿠키에서 읽기
    // initialLanguage가 제공된 경우 이미 서버-클라이언트 동기화되어 있음
    if (!initialLanguage) {
      const actualLanguage = languageManager.getCurrentLanguage();
      if (actualLanguage !== currentLanguage) {
        setCurrentLanguage(actualLanguage as TLanguage);
        onLanguageChange?.(actualLanguage as TLanguage);
      }
    }
  }, []);

  React.useEffect(() => {
    if (!isHydrated) return;

    // 언어 변경 리스너 등록
    const removeListener = languageManager.addLanguageChangeListener((lang) => {
      if (lang !== currentLanguage) {
        setCurrentLanguage(lang as TLanguage);
        onLanguageChange?.(lang as TLanguage);
      }
    });

    return removeListener;
  }, [languageManager, currentLanguage, onLanguageChange, isHydrated]);

  const contextValue: I18nContextType<TLanguage, string> = {
    currentLanguage,
    changeLanguage,
    availableLanguages: languageManager.getAvailableLanguages(),
    languageManager,
    isLoading,
    translations: defaultTranslations,
    dynamicTranslations: defaultDynamicTranslations,
  };

  return (
    <I18nContext.Provider
      value={contextValue as unknown as I18nContextType<string, string>}
    >
      {children}
    </I18nContext.Provider>
  );
}
