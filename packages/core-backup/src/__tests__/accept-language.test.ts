/**
 * Tests for Accept-Language header parsing
 */

import { parseAcceptLanguage, getServerLanguage } from "../utils/server";

describe("parseAcceptLanguage", () => {
  const availableLanguages = ["en", "ko", "ja", "zh"];

  it("should parse simple language without quality", () => {
    const result = parseAcceptLanguage("ko", availableLanguages);
    expect(result).toBe("ko");
  });

  it("should parse language with region", () => {
    const result = parseAcceptLanguage("ko-KR", availableLanguages);
    expect(result).toBe("ko");
  });

  it("should parse multiple languages with quality values", () => {
    const result = parseAcceptLanguage(
      "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7",
      availableLanguages,
    );
    expect(result).toBe("ko");
  });

  it("should respect quality values (higher quality first)", () => {
    const result = parseAcceptLanguage(
      "en;q=0.5,ko;q=0.9,ja;q=0.7",
      availableLanguages,
    );
    expect(result).toBe("ko");
  });

  it("should handle complex Accept-Language header", () => {
    const result = parseAcceptLanguage(
      "fr-CH, fr;q=0.9, en;q=0.8, de;q=0.7, *;q=0.5",
      ["en", "ko"],
    );
    expect(result).toBe("en");
  });

  it("should return null when no match found", () => {
    const result = parseAcceptLanguage("fr-FR,fr;q=0.9", availableLanguages);
    expect(result).toBeNull();
  });

  it("should return null for empty Accept-Language", () => {
    const result = parseAcceptLanguage("", availableLanguages);
    expect(result).toBeNull();
  });

  it("should return null for empty available languages", () => {
    const result = parseAcceptLanguage("ko-KR", []);
    expect(result).toBeNull();
  });

  it("should handle exact match", () => {
    const result = parseAcceptLanguage("en", availableLanguages);
    expect(result).toBe("en");
  });

  it("should match primary language from region code", () => {
    const result = parseAcceptLanguage("en-US", availableLanguages);
    expect(result).toBe("en");
  });

  it("should handle case insensitivity", () => {
    const result = parseAcceptLanguage("KO-KR", availableLanguages);
    expect(result).toBe("ko");
  });

  it("should handle whitespace", () => {
    const result = parseAcceptLanguage(
      " ko-KR , ko ; q=0.9 , en ; q=0.8 ",
      availableLanguages,
    );
    expect(result).toBe("ko");
  });

  it("should prioritize first language when quality is same", () => {
    const result = parseAcceptLanguage("ja,ko,en", availableLanguages);
    expect(result).toBe("ja");
  });

  it("should handle Chinese variants", () => {
    const result = parseAcceptLanguage("zh-CN,zh;q=0.9", ["en", "zh"]);
    expect(result).toBe("zh");
  });
});

describe("getServerLanguage with Accept-Language", () => {
  it("should prefer cookie over Accept-Language", () => {
    const headers = new Headers();
    headers.set("cookie", "i18n-language=ja");
    headers.set("accept-language", "ko-KR,ko;q=0.9");

    const result = getServerLanguage(headers, {
      availableLanguages: ["en", "ko", "ja"],
      defaultLanguage: "en",
    });

    expect(result).toBe("ja");
  });

  it("should use Accept-Language when no cookie", () => {
    const headers = new Headers();
    headers.set("accept-language", "ko-KR,ko;q=0.9,en-US;q=0.8");

    const result = getServerLanguage(headers, {
      availableLanguages: ["en", "ko", "ja"],
      defaultLanguage: "en",
    });

    expect(result).toBe("ko");
  });

  it("should fallback to default when Accept-Language does not match", () => {
    const headers = new Headers();
    headers.set("accept-language", "fr-FR,fr;q=0.9");

    const result = getServerLanguage(headers, {
      availableLanguages: ["en", "ko", "ja"],
      defaultLanguage: "en",
    });

    expect(result).toBe("en");
  });

  it("should work without availableLanguages option", () => {
    const headers = new Headers();
    headers.set("accept-language", "ko-KR");

    const result = getServerLanguage(headers, {
      defaultLanguage: "en",
    });

    // Should fallback to default since availableLanguages is not provided
    expect(result).toBe("en");
  });

  it("should handle empty headers", () => {
    const headers = new Headers();

    const result = getServerLanguage(headers, {
      availableLanguages: ["en", "ko"],
      defaultLanguage: "en",
    });

    expect(result).toBe("en");
  });

  it("should decode URI encoded cookie values", () => {
    const headers = new Headers();
    headers.set("cookie", "i18n-language=%ED%95%9C%EA%B5%AD%EC%96%B4"); // "한국어" encoded
    headers.set("accept-language", "en-US");

    const result = getServerLanguage(headers, {
      availableLanguages: ["en", "한국어"],
      defaultLanguage: "en",
    });

    expect(result).toBe("한국어");
  });

  it("should handle multiple cookies", () => {
    const headers = new Headers();
    headers.set("cookie", "session=abc123; i18n-language=ko; theme=dark");
    headers.set("accept-language", "en-US");

    const result = getServerLanguage(headers, {
      availableLanguages: ["en", "ko"],
      defaultLanguage: "en",
    });

    expect(result).toBe("ko");
  });
});
