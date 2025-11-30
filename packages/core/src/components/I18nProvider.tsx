"use client";

import React, { ReactNode } from "react";
import {
  LanguageManager,
  LanguageConfig,
  LanguageManagerOptions,
} from "../utils/languageManager";

/** 번역 객체에서 키 추출 */
export type ExtractI18nKeys<T extends Record<string, Record<string, string>>> =
  keyof T[keyof T] & string;

/** 네임스페이스별 번역 구조 */
export type NamespaceTranslations = Record<
  string, // namespace
  Record<
    string, // language
    Record<string, string> // key: value
  >
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
  translations: Record<string, Record<string, string>>;
  /** 타입 안전한 useTranslation을 위한 번역 키 */
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
  TTranslations extends Record<string, Record<string, string>> = Record<
    string,
    Record<string, string>
  >,
> {
  children: ReactNode;
  languageManagerOptions?: LanguageManagerOptions;
  translations?: TTranslations;
  onLanguageChange?: (language: TLanguage) => void;
  /** 서버 측 초기 언어 (SSR/Next.js App Router용, hydration 불일치 방지) */
  initialLanguage?: TLanguage;
}

export function I18nProvider<
  TLanguage extends string = string,
  TTranslations extends Record<string, Record<string, string>> = Record<
    string,
    Record<string, string>
  >,
>({
  children,
  languageManagerOptions,
  translations,
  onLanguageChange,
  initialLanguage,
}: I18nProviderProps<TLanguage, TTranslations>) {
  const defaultTranslations = translations || ({} as TTranslations);
  const [languageManager] = React.useState(
    () => new LanguageManager(languageManagerOptions),
  );

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
      const success = languageManager.setLanguage(lang);
      if (!success) {
        throw new Error(`Failed to set language to ${lang}`);
      }

      setCurrentLanguage(lang);
      onLanguageChange?.(lang);
    } catch (error) {
      console.error("Failed to change language:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    setIsHydrated(true);

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

    const removeListener = languageManager.addLanguageChangeListener((lang) => {
      if (lang !== currentLanguage) {
        setCurrentLanguage(lang as TLanguage);
        onLanguageChange?.(lang as TLanguage);
      }
    });

    return removeListener;
  }, [languageManager, currentLanguage, onLanguageChange, isHydrated]);

  type TKeys = ExtractI18nKeys<TTranslations>;

  const contextValue: I18nContextType<TLanguage, TKeys> = {
    currentLanguage,
    changeLanguage,
    availableLanguages: languageManager.getAvailableLanguages(),
    languageManager,
    isLoading,
    translations: defaultTranslations as Record<string, Record<string, string>>,
  };

  return (
    <I18nContext.Provider
      value={contextValue as unknown as I18nContextType<string, string>}
    >
      {children}
    </I18nContext.Provider>
  );
}
