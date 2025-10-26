/**
 * Tests for variable interpolation in translations
 */

import React from "react";
import { render, screen } from "@testing-library/react";
import { I18nProvider } from "../components/I18nProvider";
import { useTranslation } from "../hooks/useTranslation";
import { createServerTranslation } from "../utils/server";

// Test translations
const testTranslations = {
  en: {
    "Hello {{name}}": "Hello {{name}}",
    "You have {{count}} messages": "You have {{count}} messages",
    "Price: {{price}} ({{discount}}% off)":
      "Price: {{price}} ({{discount}}% off)",
    Welcome: "Welcome",
  },
  ko: {
    "Hello {{name}}": "안녕하세요 {{name}}님",
    "You have {{count}} messages": "{{count}}개의 메시지가 있습니다",
    "Price: {{price}} ({{discount}}% off)":
      "가격: {{price}}원 ({{discount}}% 할인)",
    Welcome: "환영합니다",
  },
};

describe("Variable Interpolation", () => {
  describe("Client-side (useTranslation)", () => {
    // Test component
    function TestComponent({
      translationKey,
      variables,
      styles,
    }: {
      translationKey: string;
      variables?: Record<string, string | number>;
      styles?: Record<string, React.CSSProperties>;
    }) {
      const { t } = useTranslation();

      return (
        <div data-testid="translation">
          {styles && variables
            ? t(translationKey, variables, styles)
            : t(translationKey, variables)}
        </div>
      );
    }

    it("should interpolate single variable", () => {
      render(
        <I18nProvider
          initialLanguage="en"
          translations={testTranslations}
          languageManagerOptions={{ defaultLanguage: "en" }}
        >
          <TestComponent
            translationKey="Hello {{name}}"
            variables={{ name: "World" }}
          />
        </I18nProvider>,
      );

      expect(screen.getByTestId("translation")).toHaveTextContent(
        "Hello World",
      );
    });

    it("should interpolate multiple variables", () => {
      render(
        <I18nProvider
          initialLanguage="en"
          translations={testTranslations}
          languageManagerOptions={{ defaultLanguage: "en" }}
        >
          <TestComponent
            translationKey="Price: {{price}} ({{discount}}% off)"
            variables={{ price: 100, discount: 20 }}
          />
        </I18nProvider>,
      );

      expect(screen.getByTestId("translation")).toHaveTextContent(
        "Price: 100 (20% off)",
      );
    });

    it("should work with Korean translations", () => {
      render(
        <I18nProvider
          initialLanguage="ko"
          translations={testTranslations}
          languageManagerOptions={{ defaultLanguage: "ko" }}
        >
          <TestComponent
            translationKey="Hello {{name}}"
            variables={{ name: "홍길동" }}
          />
        </I18nProvider>,
      );

      expect(screen.getByTestId("translation")).toHaveTextContent(
        "안녕하세요 홍길동님",
      );
    });

    it("should keep placeholder if variable not provided", () => {
      render(
        <I18nProvider
          initialLanguage="en"
          translations={testTranslations}
          languageManagerOptions={{ defaultLanguage: "en" }}
        >
          <TestComponent translationKey="Hello {{name}}" />
        </I18nProvider>,
      );

      expect(screen.getByTestId("translation")).toHaveTextContent(
        "Hello {{name}}",
      );
    });

    it("should handle numeric variables", () => {
      render(
        <I18nProvider
          initialLanguage="en"
          translations={testTranslations}
          languageManagerOptions={{ defaultLanguage: "en" }}
        >
          <TestComponent
            translationKey="You have {{count}} messages"
            variables={{ count: 5 }}
          />
        </I18nProvider>,
      );

      expect(screen.getByTestId("translation")).toHaveTextContent(
        "You have 5 messages",
      );
    });

    it("should work without variables", () => {
      render(
        <I18nProvider
          initialLanguage="en"
          translations={testTranslations}
          languageManagerOptions={{ defaultLanguage: "en" }}
        >
          <TestComponent translationKey="Welcome" />
        </I18nProvider>,
      );

      expect(screen.getByTestId("translation")).toHaveTextContent("Welcome");
    });

    it("should apply styles to variables", () => {
      render(
        <I18nProvider
          initialLanguage="en"
          translations={testTranslations}
          languageManagerOptions={{ defaultLanguage: "en" }}
        >
          <TestComponent
            translationKey="Hello {{name}}"
            variables={{ name: "World" }}
            styles={{ name: { color: "red", fontWeight: "bold" } }}
          />
        </I18nProvider>,
      );

      const container = screen.getByTestId("translation");
      const styledSpan = container.querySelector("span");

      expect(styledSpan).toBeInTheDocument();
      expect(styledSpan).toHaveTextContent("World");
      expect(styledSpan).toHaveStyle({ color: "red", fontWeight: "bold" });
    });

    it("should apply different styles to multiple variables", () => {
      render(
        <I18nProvider
          initialLanguage="en"
          translations={testTranslations}
          languageManagerOptions={{ defaultLanguage: "en" }}
        >
          <TestComponent
            translationKey="Price: {{price}} ({{discount}}% off)"
            variables={{ price: 100, discount: 20 }}
            styles={{
              price: { color: "blue" },
              discount: { color: "red", fontWeight: "bold" },
            }}
          />
        </I18nProvider>,
      );

      const container = screen.getByTestId("translation");
      const spans = container.querySelectorAll("span");

      expect(spans).toHaveLength(2);
      expect(spans[0]).toHaveTextContent("100");
      expect(spans[0]).toHaveStyle({ color: "blue" });
      expect(spans[1]).toHaveTextContent("20");
      expect(spans[1]).toHaveStyle({ color: "red", fontWeight: "bold" });
    });
  });

  describe("Server-side (createServerTranslation)", () => {
    it("should interpolate single variable", () => {
      const t = createServerTranslation("en", testTranslations);
      const result = t("Hello {{name}}", { name: "World" });

      expect(result).toBe("Hello World");
    });

    it("should interpolate multiple variables", () => {
      const t = createServerTranslation("en", testTranslations);
      const result = t("Price: {{price}} ({{discount}}% off)", {
        price: 100,
        discount: 20,
      });

      expect(result).toBe("Price: 100 (20% off)");
    });

    it("should work with Korean translations", () => {
      const t = createServerTranslation("ko", testTranslations);
      const result = t("Hello {{name}}", { name: "홍길동" });

      expect(result).toBe("안녕하세요 홍길동님");
    });

    it("should keep placeholder if variable not provided", () => {
      const t = createServerTranslation("en", testTranslations);
      const result = t("Hello {{name}}");

      expect(result).toBe("Hello {{name}}");
    });

    it("should handle numeric variables", () => {
      const t = createServerTranslation("en", testTranslations);
      const result = t("You have {{count}} messages", { count: 5 });

      expect(result).toBe("You have 5 messages");
    });

    it("should work without variables", () => {
      const t = createServerTranslation("en", testTranslations);
      const result = t("Welcome");

      expect(result).toBe("Welcome");
    });

    it("should support legacy fallback parameter", () => {
      const t = createServerTranslation("en", testTranslations);
      const result = t("Non-existent key", "Fallback text");

      expect(result).toBe("Fallback text");
    });

    it("should return key if not found and no fallback", () => {
      const t = createServerTranslation("en", testTranslations);
      const result = t("Non-existent key");

      expect(result).toBe("Non-existent key");
    });

    it("should handle zero as a valid variable value", () => {
      const t = createServerTranslation("en", testTranslations);
      const result = t("You have {{count}} messages", { count: 0 });

      expect(result).toBe("You have 0 messages");
    });

    it("should handle empty string as a valid variable value", () => {
      const t = createServerTranslation("en", testTranslations);
      const result = t("Hello {{name}}", { name: "" });

      expect(result).toBe("Hello ");
    });
  });

  describe("Edge cases", () => {
    it("should handle special characters in variable values", () => {
      const t = createServerTranslation("en", testTranslations);
      const result = t("Hello {{name}}", { name: "Mr. O'Brien & Co." });

      expect(result).toBe("Hello Mr. O'Brien & Co.");
    });

    it("should handle large numbers", () => {
      const t = createServerTranslation("en", testTranslations);
      const result = t("Price: {{price}} ({{discount}}% off)", {
        price: 1234567890,
        discount: 99,
      });

      expect(result).toBe("Price: 1234567890 (99% off)");
    });

    it("should handle negative numbers", () => {
      const t = createServerTranslation("en", testTranslations);
      const result = t("You have {{count}} messages", { count: -5 });

      expect(result).toBe("You have -5 messages");
    });
  });
});
