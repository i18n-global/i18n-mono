/**
 * Tests for server-side getServerTranslations with type safety
 */

import { getServerTranslations } from "../utils/server";

describe("getServerTranslations (Type-Safe)", () => {
  const translations = {
    en: {
      welcome: "Welcome",
      logout: "Logout",
      greeting: "Hello {{name}}",
    },
    ko: {
      welcome: "환영합니다",
      logout: "로그아웃",
      greeting: "안녕하세요 {{name}}",
    },
  } as const;

  it("should return translations for specified language", () => {
    const dict = getServerTranslations("en", translations);

    expect(dict.welcome).toBe("Welcome");
    expect(dict.logout).toBe("Logout");
    expect(dict.greeting).toBe("Hello {{name}}");
  });

  it("should return translations for Korean language", () => {
    const dict = getServerTranslations("ko", translations);

    expect(dict.welcome).toBe("환영합니다");
    expect(dict.logout).toBe("로그아웃");
  });

  it("should fallback to English when language not found", () => {
    const dict = getServerTranslations("fr", translations);

    // Should fallback to English
    expect(dict.welcome).toBe("Welcome");
  });

  it("should handle empty translations object", () => {
    const emptyTranslations = {
      en: {},
      ko: {},
    } as const;

    const dict = getServerTranslations("en", emptyTranslations);

    expect(dict).toEqual({});
  });

  it("should preserve type information", () => {
    const dict = getServerTranslations("en", translations);

    // Type inference should work
    const welcome: string = dict.welcome;
    const logout: string = dict.logout;

    expect(welcome).toBe("Welcome");
    expect(logout).toBe("Logout");
  });

  it("should work with namespace translations", () => {
    const namespaceTranslations = {
      common: {
        en: {
          welcome: "Welcome",
          logout: "Logout",
        },
        ko: {
          welcome: "환영합니다",
          logout: "로그아웃",
        },
      },
      menu: {
        en: {
          home: "Home",
          about: "About",
        },
        ko: {
          home: "홈",
          about: "소개",
        },
      },
    } as const;

    // Flatten namespace structure for server-side usage
    const flatTranslations = {
      en: {
        ...namespaceTranslations.common.en,
        ...namespaceTranslations.menu.en,
      },
      ko: {
        ...namespaceTranslations.common.ko,
        ...namespaceTranslations.menu.ko,
      },
    };

    const dict = getServerTranslations("en", flatTranslations);

    expect(dict.welcome).toBe("Welcome");
    expect(dict.home).toBe("Home");
  });
});
