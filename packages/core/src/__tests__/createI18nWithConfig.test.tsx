/**
 * Tests for createI18nWithConfig functionality
 */

import React from "react";
import { render, screen } from "@testing-library/react";
import * as fs from "fs";
import * as pathLib from "path";
import * as os from "os";
import { createI18nWithConfig } from "../utils/createI18nWithConfig";

describe("createI18nWithConfig", () => {
  let tempDir: string;
  let originalCwd: string;

  const translations = {
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

  beforeEach(() => {
    // Create temporary directory
    tempDir = fs.mkdtempSync(pathLib.join(os.tmpdir(), "i18nexus-test-"));
    originalCwd = process.cwd();
    process.chdir(tempDir);
  });

  afterEach(() => {
    // Restore original working directory
    process.chdir(originalCwd);

    // Clean up temporary directory
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });

  it("should use fallbackNamespace from config file", () => {
    // Create config file
    const configContent = {
      fallbackNamespace: "common",
      enableFallback: true,
    };

    fs.writeFileSync(
      "i18nexus.config.json",
      JSON.stringify(configContent, null, 2),
    );

    // Create i18n instance
    const i18n = createI18nWithConfig(translations);

    // Test component
    function TestComponent() {
      const { t } = i18n.useTranslation();

      return (
        <div>
          <div data-testid="welcome">{t("welcome")}</div>
          <div data-testid="home">{t("home")}</div>
        </div>
      );
    }

    render(
      <i18n.I18nProvider languageManagerOptions={{ defaultLanguage: "en" }}>
        <TestComponent />
      </i18n.I18nProvider>,
    );

    expect(screen.getByTestId("welcome")).toHaveTextContent("Welcome");
    expect(screen.getByTestId("home")).toHaveTextContent("Home");
  });

  it("should allow overriding config file options", () => {
    // Create config file with "common" as fallback
    const configContent = {
      fallbackNamespace: "common",
    };

    fs.writeFileSync(
      "i18nexus.config.json",
      JSON.stringify(configContent, null, 2),
    );

    // Override with "menu" as fallback
    const i18n = createI18nWithConfig(translations, {
      fallbackNamespace: "menu" as any,
    });

    expect(i18n.options.fallbackNamespace).toBe("menu");
  });

  it("should work without config file", () => {
    // No config file exists

    const i18n = createI18nWithConfig(translations);

    // Should still work, just without fallback namespace
    expect(i18n.options.fallbackNamespace).toBeUndefined();
  });

  it("should handle enableFallback option", () => {
    const configContent = {
      fallbackNamespace: "common",
      enableFallback: false,
    };

    fs.writeFileSync(
      "i18nexus.config.json",
      JSON.stringify(configContent, null, 2),
    );

    const i18n = createI18nWithConfig(translations);

    expect(i18n.options.enableFallback).toBe(false);
  });
});
