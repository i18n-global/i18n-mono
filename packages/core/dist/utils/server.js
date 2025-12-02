/** Next.js App Router 서버 컴포넌트용 유틸리티 */
import * as fs from "fs";
import * as path from "path";
/** 프로젝트 루트에서 i18nexus 설정 파일 로드 (조용히) */
async function loadConfigSilently() {
    try {
        const configPath = path.resolve(process.cwd(), "i18nexus.config.json");
        if (fs.existsSync(configPath)) {
            const raw = await fs.promises.readFile(configPath, "utf8");
            try {
                return JSON.parse(raw);
            }
            catch {
                return null;
            }
        }
        const altPath = path.resolve(process.cwd(), "i18nexus.config.js");
        if (fs.existsSync(altPath)) {
            try {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                const mod = await import(altPath);
                return mod && mod.default
                    ? mod.default
                    : mod;
            }
            catch {
                return null;
            }
        }
        return null;
    }
    catch {
        return null;
    }
}
/** Accept-Language 헤더 파싱하여 가장 적합한 언어 반환 */
export function parseAcceptLanguage(acceptLanguage, availableLanguages) {
    if (!acceptLanguage || !availableLanguages.length) {
        return null;
    }
    const languages = acceptLanguage
        .split(",")
        .map((lang) => {
        const parts = lang.trim().split(";");
        const code = parts[0].toLowerCase();
        const quality = parts[1] ? parseFloat(parts[1].split("=")[1]) : 1.0;
        return { code, quality };
    })
        .sort((a, b) => b.quality - a.quality);
    for (const { code } of languages) {
        if (availableLanguages.includes(code)) {
            return code;
        }
        const primaryLang = code.split("-")[0];
        if (availableLanguages.includes(primaryLang)) {
            return primaryLang;
        }
        const match = availableLanguages.find((lang) => lang.toLowerCase().startsWith(primaryLang));
        if (match) {
            return match;
        }
    }
    return null;
}
/** 서버 컴포넌트에서 쿠키/헤더로 언어 감지 */
export function getServerLanguage(headers, options) {
    const cookieName = options?.cookieName || "i18n-language";
    const defaultLanguage = options?.defaultLanguage || "en";
    const availableLanguages = options?.availableLanguages || [];
    const cookieHeader = headers.get("cookie");
    if (cookieHeader) {
        const cookies = cookieHeader.split(";");
        for (const cookie of cookies) {
            const [name, value] = cookie.trim().split("=");
            if (decodeURIComponent(name) === cookieName) {
                return decodeURIComponent(value);
            }
        }
    }
    if (availableLanguages.length > 0) {
        const acceptLanguage = headers.get("accept-language");
        if (acceptLanguage) {
            const detectedLang = parseAcceptLanguage(acceptLanguage, availableLanguages);
            if (detectedLang) {
                return detectedLang;
            }
        }
    }
    return defaultLanguage;
}
/** 쿠키 헤더 문자열 파싱 */
export function parseCookies(cookieHeader) {
    if (!cookieHeader) {
        return {};
    }
    const cookies = {};
    const cookieArray = cookieHeader.split(";");
    for (const cookie of cookieArray) {
        const [name, value] = cookie.trim().split("=");
        if (name && value) {
            cookies[decodeURIComponent(name)] = decodeURIComponent(value);
        }
    }
    return cookies;
}
/** 서버 번역 문자열의 변수 치환 */
function interpolateServer(text, variables) {
    if (!variables) {
        return text;
    }
    return text.replace(/\{\{(\w+)\}\}/g, (match, variableName) => {
        const value = variables[variableName];
        return value !== undefined ? String(value) : match;
    });
}
/** 서버 컴포넌트용 번역 함수 생성 */
export function createServerTranslation(language, translations) {
    const currentTranslations = translations[language] || translations["en"] || {};
    return function translate(key, variables, fallback) {
        if (typeof variables === "string") {
            return currentTranslations[key] || variables || key;
        }
        const translatedText = currentTranslations[key] || fallback || key;
        return interpolateServer(translatedText, variables);
    };
}
/** 타입 안전한 서버 번역 객체 반환 */
export function getServerTranslations(language, translations) {
    return (translations[language] || translations["en"] || {});
}
/** 디렉토리에서 번역 파일 동적 로드 */
export async function loadTranslations(localesDir) {
    try {
        const indexPath = path.resolve(process.cwd(), localesDir, "index");
        const module = await import(indexPath);
        return module.translations || {};
    }
    catch (error) {
        console.warn(`Failed to load translations from ${localesDir}/index:`, error);
        return {};
    }
}
/** 서버 번역 컨텍스트 생성 (설정 자동 로드, 헤더 자동 감지) */
/**
 * Get server-side translation function with namespace support
 *
 * @example
 * ```tsx
 * // Server Component
 * export default async function Page() {
 *   const { t } = await getTranslation<"home">("home");
 *   return <h1>{t("title")}</h1>;
 * }
 * ```
 */
export async function getTranslation(namespace, options) {
    let config;
    try {
        config = await loadConfigSilently();
    }
    catch {
        config = null;
    }
    const localesDir = options?.localesDir || config?.localesDir || "./locales";
    const defaultLanguage = options?.defaultLanguage || config?.defaultLanguage || "en";
    const cookieName = options?.cookieName || "i18n-language";
    const availableLanguages = options?.availableLanguages || [];
    let headersInstance;
    try {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const { headers } = await import("next/headers");
        headersInstance = await headers();
    }
    catch {
        headersInstance = new Headers();
    }
    const language = getServerLanguage(headersInstance, {
        cookieName,
        defaultLanguage,
        availableLanguages,
    });
    // Load translations for the specific namespace
    let translations;
    if (namespace) {
        try {
            const nsTranslations = await import(`${localesDir}/${namespace}/${language}.json`);
            translations = { [namespace]: nsTranslations.default };
        }
        catch {
            // Fallback to loading all translations
            translations = await loadTranslations(localesDir);
        }
    }
    else {
        translations = await loadTranslations(localesDir);
    }
    const t = createServerTranslation(language, translations);
    const dict = getServerTranslations(language, translations);
    return {
        t,
        language,
        lng: language, // Alias for react-i18next compatibility
        translations,
        dict,
    };
}
/**
 * @deprecated Use getTranslation() instead
 */
export async function createServerI18n(options) {
    return getTranslation(undefined, options);
}
/** 미리 로드된 번역으로 서버 i18n 컨텍스트 생성 */
export function createServerI18nWithTranslations(headers, translations, options) {
    const language = getServerLanguage(headers, options);
    const t = createServerTranslation(language, translations);
    const dict = getServerTranslations(language, translations);
    return {
        t,
        language,
        translations,
        dict,
    };
}
//# sourceMappingURL=server.js.map