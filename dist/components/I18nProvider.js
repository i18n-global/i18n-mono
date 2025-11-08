"use client";
import { jsx as _jsx } from "react/jsx-runtime";
import React from "react";
import { LanguageManager, } from "../utils/languageManager";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const I18nContext = React.createContext(null);
export const useI18nContext = () => {
    const context = React.useContext(I18nContext);
    if (!context) {
        throw new Error("useI18nContext must be used within an I18nProvider");
    }
    return context;
};
export function I18nProvider({ children, languageManagerOptions, translations, onLanguageChange, initialLanguage, }) {
    const defaultTranslations = translations || {};
    const [languageManager] = React.useState(() => new LanguageManager(languageManagerOptions));
    // Use initialLanguage (from server) if provided, otherwise use default
    // This prevents hydration mismatch
    const getInitialLanguage = () => {
        if (initialLanguage) {
            return initialLanguage;
        }
        return languageManagerOptions?.defaultLanguage || "en";
    };
    const [currentLanguage, setCurrentLanguage] = React.useState(getInitialLanguage());
    const [isLoading, setIsLoading] = React.useState(false);
    const [isHydrated, setIsHydrated] = React.useState(false);
    const changeLanguage = async (lang) => {
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
        }
        catch (error) {
            console.error("Failed to change language:", error);
            throw error;
        }
        finally {
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
                setCurrentLanguage(actualLanguage);
                onLanguageChange?.(actualLanguage);
            }
        }
    }, []);
    React.useEffect(() => {
        if (!isHydrated)
            return;
        // 언어 변경 리스너 등록
        const removeListener = languageManager.addLanguageChangeListener((lang) => {
            if (lang !== currentLanguage) {
                setCurrentLanguage(lang);
                onLanguageChange?.(lang);
            }
        });
        return removeListener;
    }, [languageManager, currentLanguage, onLanguageChange, isHydrated]);
    const contextValue = {
        currentLanguage,
        changeLanguage,
        availableLanguages: languageManager.getAvailableLanguages(),
        languageManager,
        isLoading,
        translations: defaultTranslations,
    };
    return (_jsx(I18nContext.Provider, { value: contextValue, children: children }));
}
//# sourceMappingURL=I18nProvider.js.map