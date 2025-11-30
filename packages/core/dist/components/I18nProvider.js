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
            const success = languageManager.setLanguage(lang);
            if (!success) {
                throw new Error(`Failed to set language to ${lang}`);
            }
            setCurrentLanguage(lang);
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
    React.useEffect(() => {
        setIsHydrated(true);
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