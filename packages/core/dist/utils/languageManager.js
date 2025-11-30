import { getCookie, setCookie } from "../utils/cookie";
export class LanguageManager {
    constructor(options = {}) {
        this.listeners = [];
        this.options = {
            cookieName: options.cookieName || "i18n-language",
            cookieOptions: {
                expires: 365,
                path: "/",
                sameSite: "lax",
                ...options.cookieOptions,
            },
            defaultLanguage: options.defaultLanguage || "en",
            availableLanguages: options.availableLanguages || [
                { code: "en", name: "English" },
                { code: "ko", name: "한국어" },
            ],
            enableAutoDetection: options.enableAutoDetection ?? true,
            enableLocalStorage: options.enableLocalStorage ?? true,
            storageKey: options.storageKey || "i18n-language",
        };
    }
    /**
     * 현재 언어 코드를 가져옵니다
     */
    getCurrentLanguage() {
        // 1. 쿠키에서 확인
        const cookieLanguage = getCookie(this.options.cookieName);
        if (cookieLanguage && this.isValidLanguage(cookieLanguage)) {
            return cookieLanguage;
        }
        // 2. localStorage에서 확인 (활성화된 경우)
        if (this.options.enableLocalStorage &&
            typeof localStorage !== "undefined") {
            const storageLanguage = localStorage.getItem(this.options.storageKey);
            if (storageLanguage && this.isValidLanguage(storageLanguage)) {
                return storageLanguage;
            }
        }
        // 3. 브라우저 언어 자동 감지 (활성화된 경우)
        if (this.options.enableAutoDetection && typeof navigator !== "undefined") {
            const browserLanguages = navigator.languages || [navigator.language];
            for (const browserLang of browserLanguages) {
                const langCode = browserLang.split("-")[0];
                if (this.isValidLanguage(langCode)) {
                    return langCode;
                }
            }
        }
        // 4. 기본 언어 반환
        return this.options.defaultLanguage;
    }
    /**
     * 언어를 변경합니다
     */
    setLanguage(languageCode) {
        if (!this.isValidLanguage(languageCode)) {
            console.warn(`Language "${languageCode}" is not available. Available languages: ${this.getAvailableLanguageCodes().join(", ")}`);
            return false;
        }
        try {
            // 쿠키에 저장
            setCookie(this.options.cookieName, languageCode, this.options.cookieOptions);
            // localStorage에 저장 (활성화된 경우)
            if (this.options.enableLocalStorage &&
                typeof localStorage !== "undefined") {
                localStorage.setItem(this.options.storageKey, languageCode);
            }
            // HTML lang 속성 업데이트
            if (typeof document !== "undefined") {
                document.documentElement.lang = languageCode;
                // RTL 언어 지원
                const languageConfig = this.getLanguageConfig(languageCode);
                if (languageConfig?.dir) {
                    document.documentElement.dir = languageConfig.dir;
                }
            }
            // 리스너들에게 알림
            this.notifyLanguageChange(languageCode);
            return true;
        }
        catch (error) {
            console.error("Failed to set language:", error);
            return false;
        }
    }
    /**
     * 언어 변경 리스너를 추가합니다
     */
    addLanguageChangeListener(listener) {
        this.listeners.push(listener);
        // 리스너 제거 함수 반환
        return () => {
            const index = this.listeners.indexOf(listener);
            if (index > -1) {
                this.listeners.splice(index, 1);
            }
        };
    }
    /**
     * 사용 가능한 언어 목록을 가져옵니다
     */
    getAvailableLanguages() {
        return this.options.availableLanguages;
    }
    /**
     * 사용 가능한 언어 코드 목록을 가져옵니다
     */
    getAvailableLanguageCodes() {
        return this.options.availableLanguages.map((lang) => lang.code);
    }
    /**
     * 쿠키 이름을 가져옵니다 (서버에서 사용)
     */
    getCookieName() {
        return this.options.cookieName;
    }
    /**
     * 기본 언어를 가져옵니다 (서버에서 사용)
     */
    getDefaultLanguage() {
        return this.options.defaultLanguage;
    }
    /**
     * 특정 언어의 설정을 가져옵니다
     */
    getLanguageConfig(languageCode) {
        return this.options.availableLanguages.find((lang) => lang.code === languageCode);
    }
    /**
     * 언어 코드가 유효한지 확인합니다
     */
    isValidLanguage(languageCode) {
        return this.getAvailableLanguageCodes().includes(languageCode);
    }
    /**
     * 언어 변경을 리스너들에게 알립니다
     */
    notifyLanguageChange(languageCode) {
        this.listeners.forEach((listener) => {
            try {
                listener(languageCode);
            }
            catch (error) {
                console.error("Error in language change listener:", error);
            }
        });
    }
    /**
     * 브라우저의 선호 언어를 감지합니다
     */
    detectBrowserLanguage() {
        if (typeof navigator === "undefined") {
            return null;
        }
        const browserLanguages = navigator.languages || [navigator.language];
        for (const browserLang of browserLanguages) {
            const langCode = browserLang.split("-")[0];
            if (this.isValidLanguage(langCode)) {
                return langCode;
            }
        }
        return null;
    }
    /**
     * 언어 설정을 초기화합니다
     */
    reset() {
        // 쿠키 제거
        if (typeof document !== "undefined") {
            document.cookie = `${this.options.cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        }
        // localStorage 제거
        if (this.options.enableLocalStorage &&
            typeof localStorage !== "undefined") {
            localStorage.removeItem(this.options.storageKey);
        }
        // 기본 언어로 설정
        this.setLanguage(this.options.defaultLanguage);
    }
}
// 기본 인스턴스 생성
export const defaultLanguageManager = new LanguageManager();
//# sourceMappingURL=languageManager.js.map