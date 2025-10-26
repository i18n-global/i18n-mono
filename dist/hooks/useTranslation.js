"use client";
import React from "react";
import { useI18nContext } from "../components/I18nProvider";
/**
 * Replace variables in a translation string
 * @param text - Text with {{variable}} placeholders
 * @param variables - Object with variable values
 * @returns Text with variables replaced
 */
const interpolate = (text, variables) => {
    if (!variables) {
        return text;
    }
    return text.replace(/\{\{(\w+)\}\}/g, (match, variableName) => {
        const value = variables[variableName];
        return value !== undefined ? String(value) : match;
    });
};
/**
 * Replace variables in a translation string with React elements (with styles)
 * @param text - Text with {{variable}} placeholders
 * @param variables - Object with variable values
 * @param styles - Object with styles for variables
 * @returns React elements with styled variables
 */
const interpolateWithStyles = (text, variables, styles) => {
    // Split text by variable placeholders
    const parts = [];
    let lastIndex = 0;
    const regex = /\{\{(\w+)\}\}/g;
    let match;
    let key = 0;
    while ((match = regex.exec(text)) !== null) {
        // Add text before the variable
        if (match.index > lastIndex) {
            parts.push(text.substring(lastIndex, match.index));
        }
        const variableName = match[1];
        const value = variables[variableName];
        const style = styles[variableName];
        if (value !== undefined) {
            if (style) {
                // Wrap with span if style is provided
                parts.push(React.createElement("span", { key: `var-${key++}`, style: style }, String(value)));
            }
            else {
                // Just add the value as string
                parts.push(String(value));
            }
        }
        else {
            // Keep placeholder if value not found
            parts.push(match[0]);
        }
        lastIndex = regex.lastIndex;
    }
    // Add remaining text
    if (lastIndex < text.length) {
        parts.push(text.substring(lastIndex));
    }
    return React.createElement(React.Fragment, null, ...parts);
};
/**
 * Hook to access translation function and current language
 */
export const useTranslation = () => {
    const { currentLanguage, isLoading, translations } = useI18nContext();
    // i18nexus 자체 번역 시스템 사용
    const translate = ((key, variables, styles) => {
        const currentTranslations = translations[currentLanguage] || {};
        const translatedText = currentTranslations[key] || key;
        // If styles are provided, return React elements
        if (styles && variables) {
            return interpolateWithStyles(translatedText, variables, styles);
        }
        // Otherwise return string
        return interpolate(translatedText, variables);
    });
    return {
        t: translate,
        currentLanguage,
        isReady: !isLoading,
    };
};
/**
 * Hook to access language switching functionality
 */
export const useLanguageSwitcher = () => {
    const { currentLanguage, changeLanguage, availableLanguages, languageManager, isLoading, } = useI18nContext();
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
        const prevIndex = currentIndex === 0 ? languageCodes.length - 1 : currentIndex - 1;
        const prevLanguage = languageCodes[prevIndex];
        await changeLanguage(prevLanguage);
    };
    const getLanguageConfig = (code) => {
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
        switchLng: changeLanguage, // Alias for better compatibility
        switchToNextLanguage,
        switchToPreviousLanguage,
        getLanguageConfig,
        detectBrowserLanguage,
        resetLanguage,
        isLoading,
    };
};
//# sourceMappingURL=useTranslation.js.map