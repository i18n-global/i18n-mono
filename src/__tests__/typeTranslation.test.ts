import {
  createTypedTranslation,
  createMultiLangTypedTranslation,
  validateTranslationKeys,
  getTranslationKeyList,
  ExtractLanguageKeys,
} from "../utils/typeTranslation";

describe("Type-Safe Translation Utilities", () => {
  const translations = {
    en: {
      greeting: "Hello {{name}}",
      farewell: "Goodbye {{name}}",
      welcome: "Welcome",
      count: "Count: {{count}}",
    },
    ko: {
      greeting: "안녕하세요 {{name}}",
      farewell: "안녕히 가세요 {{name}}",
      welcome: "환영합니다",
      count: "개수: {{count}}",
    },
    ja: {
      greeting: "こんにちは {{name}}",
      farewell: "さようなら {{name}}",
      welcome: "ようこそ",
      count: "数: {{count}}",
    },
  } as const;

  describe("createTypedTranslation", () => {
    it("should translate with variables", () => {
      const t = createTypedTranslation(translations.en);
      const result = t("greeting", { name: "Alice" });
      expect(result).toBe("Hello Alice");
    });

    it("should translate without variables", () => {
      const t = createTypedTranslation(translations.en);
      const result = t("welcome");
      expect(result).toBe("Welcome");
    });

    it("should handle multiple variables", () => {
      const t = createTypedTranslation(translations.en);
      const result = t("count", { count: 42 });
      expect(result).toBe("Count: 42");
    });

    it("should work with all languages", () => {
      const tEn = createTypedTranslation(translations.en);
      const tKo = createTypedTranslation(translations.ko);
      const tJa = createTypedTranslation(translations.ja);

      expect(tEn("greeting", { name: "Bob" })).toBe("Hello Bob");
      expect(tKo("greeting", { name: "철수" })).toBe("안녕하세요 철수");
      expect(tJa("greeting", { name: "太郎" })).toBe("こんにちは 太郎");
    });

    it("should keep placeholders if variable not provided", () => {
      const t = createTypedTranslation(translations.en);
      const result = t("greeting", { age: 25 }); // name not provided
      expect(result).toBe("Hello {{name}}");
    });

    it("should return fallback key if translation not found", () => {
      const t = createTypedTranslation(translations.en);
      // When translation doesn't exist, should return the key as fallback
      const result = t("nonexistent" as unknown as "greeting");
      expect(result).toBe("nonexistent");
    });
  });

  describe("createMultiLangTypedTranslation", () => {
    it("should create typed translators for each language", () => {
      const getT = createMultiLangTypedTranslation(translations);

      const tEn = getT("en");
      const tKo = getT("ko");

      expect(tEn("greeting", { name: "Alice" })).toBe("Hello Alice");
      expect(tKo("greeting", { name: "철수" })).toBe("안녕하세요 철수");
    });

    it("should support all languages", () => {
      const getT = createMultiLangTypedTranslation(translations);

      const tJa = getT("ja");
      expect(tJa("welcome")).toBe("ようこそ");
    });
  });

  describe("validateTranslationKeys", () => {
    it("should pass when all keys match", () => {
      expect(() => validateTranslationKeys(translations)).not.toThrow();
    });

    it("should throw when a key is missing in a language", () => {
      const badTranslations = {
        en: { greeting: "Hello", farewell: "Goodbye" },
        ko: { greeting: "안녕" }, // farewell missing
      };

      expect(() => validateTranslationKeys(badTranslations)).toThrow(
        'Missing key "farewell" in language "ko"',
      );
    });

    it("should throw when there are extra keys in a language", () => {
      const badTranslations = {
        en: { greeting: "Hello" },
        ko: { greeting: "안녕", extra: "추가" }, // extra not in en
      };

      expect(() => validateTranslationKeys(badTranslations)).toThrow(
        'Extra key "extra" in language "ko"',
      );
    });

    it("should throw with no translations", () => {
      const empty = {};
      expect(() => validateTranslationKeys(empty)).toThrow(
        "No languages found in translations",
      );
    });
  });

  describe("getTranslationKeyList", () => {
    it("should return all keys from translation object", () => {
      const keys = getTranslationKeyList(translations.en);
      expect(keys).toContain("greeting");
      expect(keys).toContain("farewell");
      expect(keys).toContain("welcome");
      expect(keys).toContain("count");
      expect(keys).toHaveLength(4);
    });

    it("should return keys in a predictable order", () => {
      const keys1 = getTranslationKeyList(translations.en);
      const keys2 = getTranslationKeyList(translations.en);
      expect(keys1).toEqual(keys2);
    });

    it("should work with different language objects", () => {
      const keysEn = getTranslationKeyList(translations.en);
      const keysKo = getTranslationKeyList(translations.ko);
      const keysJa = getTranslationKeyList(translations.ja);

      expect(keysEn).toEqual(keysKo);
      expect(keysKo).toEqual(keysJa);
    });
  });

  describe("Type extraction", () => {
    it("should extract correct language keys type", () => {
      type EnKeys = ExtractLanguageKeys<typeof translations.en>;
      // This test mainly checks that the type works
      const key: EnKeys = "greeting";
      expect(key).toBe("greeting");
    });
  });

  describe("Edge cases", () => {
    it("should handle empty variable object", () => {
      const t = createTypedTranslation(translations.en);
      const result = t("welcome");
      expect(result).toBe("Welcome");
    });

    it("should handle translation with no variables", () => {
      const t = createTypedTranslation(translations.en);
      const result = t("welcome", {});
      expect(result).toBe("Welcome");
    });

    it("should handle numeric variables", () => {
      const t = createTypedTranslation(translations.en);
      const result = t("count", { count: 100 });
      expect(result).toBe("Count: 100");
    });

    it("should handle multiple same variable", () => {
      const lang = { message: "{{name}} loves {{name}}" };
      const t = createTypedTranslation(lang);
      const result = t("message", { name: "Alice" });
      expect(result).toBe("Alice loves Alice");
    });
  });
});
