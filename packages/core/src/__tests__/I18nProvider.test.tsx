/**
 * Tests for I18nProvider core functionality
 *
 * Note: These tests verify the base Provider behavior.
 * For type-safe i18n usage, use createI18n (see createI18n.test.tsx)
 */

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { I18nProvider, useI18nContext } from "../components/I18nProvider";

// Mock react-i18next
jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: {
      changeLanguage: jest.fn(),
      language: "en",
    },
  }),
}));

// Mock cookie utilities
jest.mock("../utils/cookie", () => ({
  getCookie: jest.fn(),
  setCookie: jest.fn(),
}));

// Test component to access context
const TestComponent: React.FC = () => {
  const { currentLanguage, changeLanguage, availableLanguages } =
    useI18nContext();

  return (
    <div>
      <div data-testid="current-language">{currentLanguage}</div>
      <div data-testid="available-languages">
        {availableLanguages.map((lang) => lang.code).join(",")}
      </div>
      <button
        data-testid="change-language"
        onClick={() => changeLanguage("ko")}
      >
        Change to Korean
      </button>
    </div>
  );
};

describe("I18nProvider", () => {
  beforeEach(() => {
    document.cookie = "";
  });

  it("should provide default language when no cookie exists", () => {
    render(
      <I18nProvider
        languageManagerOptions={{
          defaultLanguage: "en",
          availableLanguages: [
            { code: "en", name: "English" },
            { code: "ko", name: "Korean" },
          ],
        }}
      >
        <TestComponent />
      </I18nProvider>,
    );

    expect(screen.getByTestId("current-language")).toHaveTextContent("en");
  });

  it("should provide available languages", () => {
    render(
      <I18nProvider
        languageManagerOptions={{
          defaultLanguage: "en",
          availableLanguages: [
            { code: "en", name: "English" },
            { code: "ko", name: "Korean" },
          ],
        }}
      >
        <TestComponent />
      </I18nProvider>,
    );

    expect(screen.getByTestId("available-languages")).toHaveTextContent(
      "en,ko",
    );
  });

  it("should change language when changeLanguage is called", async () => {
    render(
      <I18nProvider
        languageManagerOptions={{
          defaultLanguage: "en",
          availableLanguages: [
            { code: "en", name: "English" },
            { code: "ko", name: "Korean" },
          ],
        }}
      >
        <TestComponent />
      </I18nProvider>,
    );

    const changeButton = screen.getByTestId("change-language");
    fireEvent.click(changeButton);

    await waitFor(() => {
      expect(screen.getByTestId("current-language")).toHaveTextContent("ko");
    });
  });

  it("should throw error when useI18nContext is used outside provider", () => {
    // Suppress console.error for this test
    const consoleSpy = jest.spyOn(console, "error").mockImplementation();

    // Render should cause an error to be logged
    expect(() => {
      render(<TestComponent />);
    }).toThrow();

    consoleSpy.mockRestore();
  });

  it("should initialize language manager with options", () => {
    const onLanguageChange = jest.fn();

    render(
      <I18nProvider
        languageManagerOptions={{
          defaultLanguage: "ko",
          availableLanguages: [
            { code: "en", name: "English" },
            { code: "ko", name: "Korean" },
          ],
        }}
        onLanguageChange={onLanguageChange}
      >
        <TestComponent />
      </I18nProvider>,
    );

    expect(screen.getByTestId("current-language")).toHaveTextContent("ko");
  });
});
