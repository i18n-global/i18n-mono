import { CookieOptions } from "../utils/cookie";
export interface LanguageConfig {
    code: string;
    name: string;
    flag?: string;
    dir?: "ltr" | "rtl";
}
export interface LanguageManagerOptions {
    cookieName?: string;
    cookieOptions?: CookieOptions;
    defaultLanguage?: string;
    availableLanguages?: LanguageConfig[];
    enableAutoDetection?: boolean;
    enableLocalStorage?: boolean;
    storageKey?: string;
}
export declare class LanguageManager {
    private options;
    private listeners;
    constructor(options?: LanguageManagerOptions);
    /**
     * 현재 언어 코드를 가져옵니다
     */
    getCurrentLanguage(): string;
    /**
     * 언어를 변경합니다
     */
    setLanguage(languageCode: string): boolean;
    /**
     * 언어 변경 리스너를 추가합니다
     */
    addLanguageChangeListener(listener: (language: string) => void): () => void;
    /**
     * 사용 가능한 언어 목록을 가져옵니다
     */
    getAvailableLanguages(): LanguageConfig[];
    /**
     * 사용 가능한 언어 코드 목록을 가져옵니다
     */
    getAvailableLanguageCodes(): string[];
    /**
     * 특정 언어의 설정을 가져옵니다
     */
    getLanguageConfig(languageCode: string): LanguageConfig | undefined;
    /**
     * 언어 코드가 유효한지 확인합니다
     */
    private isValidLanguage;
    /**
     * 언어 변경을 리스너들에게 알립니다
     */
    private notifyLanguageChange;
    /**
     * 브라우저의 선호 언어를 감지합니다
     */
    detectBrowserLanguage(): string | null;
    /**
     * 언어 설정을 초기화합니다
     */
    reset(): void;
}
export declare const defaultLanguageManager: LanguageManager;
//# sourceMappingURL=languageManager.d.ts.map