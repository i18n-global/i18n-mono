"use client";
import React from "react";
import { useI18nContext } from "../components/I18nProvider";
/** 번역 문자열의 변수 치환 */
const interpolate = (text, variables) => {
    if (!variables) {
        return text;
    }
    return text.replace(/\{\{(\w+)\}\}/g, (match, variableName) => {
        const value = variables[variableName];
        return value !== undefined ? String(value) : match;
    });
};
/** 스타일이 적용된 React 요소로 변수 치환 */
const interpolateWithStyles = (text, variables, styles) => {
    const parts = [];
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
                parts.push(React.createElement("span", { key: `var-${key++}`, style: style }, String(value)));
            }
            else {
                parts.push(String(value));
            }
        }
        else {
            parts.push(match[0]);
        }
        lastIndex = regex.lastIndex;
    }
    if (lastIndex < text.length) {
        parts.push(text.substring(lastIndex));
    }
    return React.createElement(React.Fragment, null, ...parts);
};
/** 번역 함수 및 현재 언어 접근 훅 */
export function useTranslation() {
    const context = useI18nContext();
    const { currentLanguage, isLoading, translations } = context;
    const translate = ((key, variables, styles) => {
        const currentTranslations = translations[currentLanguage] || {};
        const translatedText = currentTranslations[key] || key;
        if (styles && variables) {
            return interpolateWithStyles(translatedText, variables, styles);
        }
        return interpolate(translatedText, variables);
    });
    return {
        t: translate,
        currentLanguage,
        isReady: !isLoading,
    };
}
/** 언어 전환 기능 접근 훅 */
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
        switchLng: changeLanguage,
        switchToNextLanguage,
        switchToPreviousLanguage,
        getLanguageConfig,
        detectBrowserLanguage,
        resetLanguage,
        isLoading,
    };
};
//# sourceMappingURL=useTranslation.js.map