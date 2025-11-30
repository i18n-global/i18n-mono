import { getCookie, setCookie, CookieOptions } from "../utils/cookie";

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

export class LanguageManager {
  private options: Required<LanguageManagerOptions>;
  private listeners: Array<(language: string) => void> = [];

  constructor(options: LanguageManagerOptions = {}) {
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
   * 서버와 클라이언트 모두에서 동작 (Hydration 에러 방지)
   */
  getCurrentLanguage(): string {
    // 서버 환경에서 쿠키 읽기
    if (typeof window === "undefined") {
      try {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const { headers } = require("next/headers");
        const headersList = headers();
        const { getServerLanguage } = require("./server");
        return getServerLanguage(headersList, {
          cookieName: this.options.cookieName,
          defaultLanguage: this.options.defaultLanguage,
          availableLanguages: this.getAvailableLanguageCodes(),
        });
      } catch {
        // next/headers를 사용할 수 없는 경우 기본 언어 반환
        return this.options.defaultLanguage;
      }
    }

    // 클라이언트 환경
    // 1. 쿠키에서 확인
    const cookieLanguage = getCookie(this.options.cookieName);
    if (cookieLanguage && this.isValidLanguage(cookieLanguage)) {
      return cookieLanguage;
    }

    // 2. localStorage에서 확인 (활성화된 경우)
    if (
      this.options.enableLocalStorage &&
      typeof localStorage !== "undefined"
    ) {
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
  setLanguage(languageCode: string): boolean {
    if (!this.isValidLanguage(languageCode)) {
      console.warn(
        `Language "${languageCode}" is not available. Available languages: ${this.getAvailableLanguageCodes().join(
          ", ",
        )}`,
      );
      return false;
    }

    try {
      // 쿠키에 저장
      setCookie(
        this.options.cookieName,
        languageCode,
        this.options.cookieOptions,
      );

      // localStorage에 저장 (활성화된 경우)
      if (
        this.options.enableLocalStorage &&
        typeof localStorage !== "undefined"
      ) {
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
    } catch (error) {
      console.error("Failed to set language:", error);
      return false;
    }
  }

  /**
   * 언어 변경 리스너를 추가합니다
   */
  addLanguageChangeListener(listener: (language: string) => void): () => void {
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
  getAvailableLanguages(): LanguageConfig[] {
    return this.options.availableLanguages;
  }

  /**
   * 사용 가능한 언어 코드 목록을 가져옵니다
   */
  getAvailableLanguageCodes(): string[] {
    return this.options.availableLanguages.map((lang) => lang.code);
  }

  /**
   * 쿠키 이름을 가져옵니다 (서버에서 사용)
   */
  getCookieName(): string {
    return this.options.cookieName;
  }

  /**
   * 기본 언어를 가져옵니다 (서버에서 사용)
   */
  getDefaultLanguage(): string {
    return this.options.defaultLanguage;
  }

  /**
   * 특정 언어의 설정을 가져옵니다
   */
  getLanguageConfig(languageCode: string): LanguageConfig | undefined {
    return this.options.availableLanguages.find(
      (lang) => lang.code === languageCode,
    );
  }

  /**
   * 언어 코드가 유효한지 확인합니다
   */
  private isValidLanguage(languageCode: string): boolean {
    return this.getAvailableLanguageCodes().includes(languageCode);
  }

  /**
   * 언어 변경을 리스너들에게 알립니다
   */
  private notifyLanguageChange(languageCode: string): void {
    this.listeners.forEach((listener) => {
      try {
        listener(languageCode);
      } catch (error) {
        console.error("Error in language change listener:", error);
      }
    });
  }

  /**
   * 브라우저의 선호 언어를 감지합니다
   */
  detectBrowserLanguage(): string | null {
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
  reset(): void {
    // 쿠키 제거
    if (typeof document !== "undefined") {
      document.cookie = `${this.options.cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    }

    // localStorage 제거
    if (
      this.options.enableLocalStorage &&
      typeof localStorage !== "undefined"
    ) {
      localStorage.removeItem(this.options.storageKey);
    }

    // 기본 언어로 설정
    this.setLanguage(this.options.defaultLanguage);
  }
}

// 기본 인스턴스 생성
export const defaultLanguageManager = new LanguageManager();
