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
export function I18nProvider({ children, languageManagerOptions, translations = {}, onLanguageChange, initialLanguage, loadNamespace, fallbackNamespace, preloadNamespaces = [], }) {
    // Lazy mode is automatically enabled if loadNamespace is provided
    const lazy = !!loadNamespace;
    const defaultTranslations = translations;
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
    // Lazy loading을 위한 로드된 네임스페이스 추적 (state로 변경하여 리렌더링 트리거)
    const [loadedNamespaces, setLoadedNamespaces] = React.useState(() => new Map());
    // Preload namespaces (fallback + additional preload namespaces)
    React.useEffect(() => {
        if (!lazy || !loadNamespace)
            return;
        const languages = languageManager.getAvailableLanguageCodes();
        const namespacesToPreload = new Set();
        // Always preload fallback namespace
        if (fallbackNamespace) {
            namespacesToPreload.add(String(fallbackNamespace));
        }
        // Add additional preload namespaces
        preloadNamespaces.forEach((ns) => namespacesToPreload.add(String(ns)));
        // Preload all namespaces
        namespacesToPreload.forEach((nsKey) => {
            // Check if already loaded to avoid duplicate loads
            if (loadedNamespaces.has(nsKey)) {
                return;
            }
            Promise.all(languages.map(async (lang) => {
                try {
                    const data = await loadNamespace(nsKey, lang);
                    return { lang, data };
                }
                catch (error) {
                    console.warn(`Failed to preload namespace "${nsKey}" for language "${lang}":`, error);
                    return { lang, data: {} };
                }
            })).then((results) => {
                const nsData = {};
                results.forEach(({ lang, data }) => {
                    nsData[lang] = data;
                });
                setLoadedNamespaces((prev) => {
                    // Double-check before setting to avoid race conditions
                    if (prev.has(nsKey)) {
                        return prev;
                    }
                    const newMap = new Map(prev);
                    newMap.set(nsKey, nsData);
                    console.log(`✓ Preloaded namespace "${nsKey}" for languages: [${languages.join(", ")}]`);
                    return newMap;
                });
            });
        });
    }, [
        lazy,
        loadNamespace,
        fallbackNamespace,
        preloadNamespaces,
        languageManager,
    ]);
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
        namespaceTranslations: defaultTranslations,
        loadedNamespaces,
        lazy,
        loadNamespace,
        fallbackNamespace,
    };
    return (_jsx(I18nContext.Provider, { value: contextValue, children: children }));
}
//# sourceMappingURL=I18nProvider.js.map