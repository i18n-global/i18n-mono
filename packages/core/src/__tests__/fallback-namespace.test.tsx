/**
 * Tests for fallback namespace functionality
 */

import React from "react";
import { render, screen } from "@testing-library/react";
import { createI18n } from "../utils/createI18n";

describe("Fallback Namespace", () => {
  const translations = {
    common: {
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
    },
    menu: {
      en: {
        home: "Home",
        about: "About",
        contact: "Contact",
      },
      ko: {
        home: "홈",
        about: "소개",
        contact: "연락처",
      },
    },
    admin: {
      en: {
        dashboard: "Dashboard",
        users: "Users",
      },
      ko: {
        dashboard: "대시보드",
        users: "사용자",
      },
    },
  } as const;

  describe("Without fallback namespace", () => {
    it("should allow accessing all keys when no namespace is specified", () => {
      const i18n = createI18n(translations);

      function TestComponent() {
        const { t } = i18n.useTranslation();

        return (
          <div>
            <div data-testid="common">{t("welcome")}</div>
            <div data-testid="menu">{t("home")}</div>
            <div data-testid="admin">{t("dashboard")}</div>
          </div>
        );
      }

      render(
        <i18n.I18nProvider languageManagerOptions={{ defaultLanguage: "en" }}>
          <TestComponent />
        </i18n.I18nProvider>,
      );

      expect(screen.getByTestId("common")).toHaveTextContent("Welcome");
      expect(screen.getByTestId("menu")).toHaveTextContent("Home");
      expect(screen.getByTestId("admin")).toHaveTextContent("Dashboard");
    });

    it("should allow accessing specific namespace keys", () => {
      const i18n = createI18n(translations);

      function TestComponent() {
        const { t } = i18n.useTranslation("menu");

        return (
          <div>
            <div data-testid="menu-home">{t("home")}</div>
            <div data-testid="menu-about">{t("about")}</div>
          </div>
        );
      }

      render(
        <i18n.I18nProvider languageManagerOptions={{ defaultLanguage: "en" }}>
          <TestComponent />
        </i18n.I18nProvider>,
      );

      expect(screen.getByTestId("menu-home")).toHaveTextContent("Home");
      expect(screen.getByTestId("menu-about")).toHaveTextContent("About");
    });
  });

  describe("With fallback namespace", () => {
    it("should expose fallback namespace in options", () => {
      const i18n = createI18n(translations, {
        fallbackNamespace: "common",
      });

      expect(i18n.options.fallbackNamespace).toBe("common");
      expect(i18n.options.enableFallback).toBe(true);
    });

    it("should work with fallback namespace disabled", () => {
      const i18n = createI18n(translations, {
        fallbackNamespace: "common",
        enableFallback: false,
      });

      expect(i18n.options.enableFallback).toBe(false);
    });

    it("should access all keys when no namespace is specified (with fallback)", () => {
      const i18n = createI18n(translations, {
        fallbackNamespace: "common",
      });

      function TestComponent() {
        const { t } = i18n.useTranslation();

        return (
          <div>
            <div data-testid="common">{t("welcome")}</div>
            <div data-testid="menu">{t("home")}</div>
            <div data-testid="admin">{t("dashboard")}</div>
          </div>
        );
      }

      render(
        <i18n.I18nProvider languageManagerOptions={{ defaultLanguage: "en" }}>
          <TestComponent />
        </i18n.I18nProvider>,
      );

      expect(screen.getByTestId("common")).toHaveTextContent("Welcome");
      expect(screen.getByTestId("menu")).toHaveTextContent("Home");
      expect(screen.getByTestId("admin")).toHaveTextContent("Dashboard");
    });

    it("should work with Korean language", () => {
      const i18n = createI18n(translations, {
        fallbackNamespace: "common",
      });

      function TestComponent() {
        const { t } = i18n.useTranslation();

        return (
          <div>
            <div data-testid="common">{t("welcome")}</div>
            <div data-testid="menu">{t("home")}</div>
          </div>
        );
      }

      render(
        <i18n.I18nProvider
          initialLanguage="ko"
          languageManagerOptions={{ defaultLanguage: "ko" }}
        >
          <TestComponent />
        </i18n.I18nProvider>,
      );

      expect(screen.getByTestId("common")).toHaveTextContent("환영합니다");
      expect(screen.getByTestId("menu")).toHaveTextContent("홈");
    });

    it("should handle variable interpolation", () => {
      const i18n = createI18n(translations, {
        fallbackNamespace: "common",
      });

      function TestComponent() {
        const { t } = i18n.useTranslation();

        return (
          <div data-testid="greeting">{t("greeting", { name: "World" })}</div>
        );
      }

      render(
        <i18n.I18nProvider languageManagerOptions={{ defaultLanguage: "en" }}>
          <TestComponent />
        </i18n.I18nProvider>,
      );

      expect(screen.getByTestId("greeting")).toHaveTextContent("Hello World");
    });
  });

  describe("Type safety (compile-time)", () => {
    it("should infer all keys when no namespace specified", () => {
      const i18n = createI18n(translations, {
        fallbackNamespace: "common",
      });

      function TestComponent() {
        const { t } = i18n.useTranslation();

        // All these should compile without errors
        t("welcome"); // from common
        t("home"); // from menu
        t("dashboard"); // from admin

        return <div>Type test</div>;
      }

      expect(TestComponent).toBeDefined();
    });

    it("should infer namespace keys when namespace specified", () => {
      const i18n = createI18n(translations, {
        fallbackNamespace: "common",
      });

      function TestComponent() {
        const { t } = i18n.useTranslation("menu");

        // These should compile
        t("home"); // from menu
        t("about"); // from menu
        t("welcome"); // from fallback (common)

        return <div>Type test</div>;
      }

      expect(TestComponent).toBeDefined();
    });
  });

  describe("Multiple useTranslation calls", () => {
    it("should work with multiple namespace-specific hooks", () => {
      const i18n = createI18n(translations, {
        fallbackNamespace: "common",
      });

      function TestComponent() {
        const { t: tCommon } = i18n.useTranslation("common");
        const { t: tMenu } = i18n.useTranslation("menu");
        const { t: tAdmin } = i18n.useTranslation("admin");

        return (
          <div>
            <div data-testid="common">{tCommon("welcome")}</div>
            <div data-testid="menu">{tMenu("home")}</div>
            <div data-testid="admin">{tAdmin("dashboard")}</div>
          </div>
        );
      }

      render(
        <i18n.I18nProvider languageManagerOptions={{ defaultLanguage: "en" }}>
          <TestComponent />
        </i18n.I18nProvider>,
      );

      expect(screen.getByTestId("common")).toHaveTextContent("Welcome");
      expect(screen.getByTestId("menu")).toHaveTextContent("Home");
      expect(screen.getByTestId("admin")).toHaveTextContent("Dashboard");
    });

    it("should work with mixed namespace and no-namespace hooks", () => {
      const i18n = createI18n(translations, {
        fallbackNamespace: "common",
      });

      function TestComponent() {
        const { t } = i18n.useTranslation(); // All keys
        const { t: tMenu } = i18n.useTranslation("menu"); // Menu keys

        return (
          <div>
            <div data-testid="all-welcome">{t("welcome")}</div>
            <div data-testid="all-dashboard">{t("dashboard")}</div>
            <div data-testid="menu-home">{tMenu("home")}</div>
          </div>
        );
      }

      render(
        <i18n.I18nProvider languageManagerOptions={{ defaultLanguage: "en" }}>
          <TestComponent />
        </i18n.I18nProvider>,
      );

      expect(screen.getByTestId("all-welcome")).toHaveTextContent("Welcome");
      expect(screen.getByTestId("all-dashboard")).toHaveTextContent(
        "Dashboard",
      );
      expect(screen.getByTestId("menu-home")).toHaveTextContent("Home");
    });
  });

  describe("Edge cases", () => {
    it("should handle missing keys gracefully", () => {
      const i18n = createI18n(translations, {
        fallbackNamespace: "common",
      });

      function TestComponent() {
        const { t } = i18n.useTranslation();

        return <div data-testid="missing">{t("nonexistent" as any)}</div>;
      }

      render(
        <i18n.I18nProvider languageManagerOptions={{ defaultLanguage: "en" }}>
          <TestComponent />
        </i18n.I18nProvider>,
      );

      // Should return the key itself when not found
      expect(screen.getByTestId("missing")).toHaveTextContent("nonexistent");
    });

    it("should work with single translation", () => {
      const singleTranslations = {
        common: {
          en: { test: "Test" },
          ko: { test: "테스트" },
        },
      } as const;

      const i18n = createI18n(singleTranslations, {
        fallbackNamespace: "common",
      });

      function TestComponent() {
        const { t } = i18n.useTranslation();

        return <div data-testid="test">{t("test")}</div>;
      }

      render(
        <i18n.I18nProvider languageManagerOptions={{ defaultLanguage: "en" }}>
          <TestComponent />
        </i18n.I18nProvider>,
      );

      expect(screen.getByTestId("test")).toHaveTextContent("Test");
    });
  });
});
