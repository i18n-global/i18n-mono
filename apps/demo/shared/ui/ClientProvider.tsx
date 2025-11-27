"use client";

import { ReactNode } from "react";

import { i18n } from "@/locales";

interface ClientProviderProps {
  children: ReactNode;
  translations: Record<string, Record<string, string>>;
  initialLanguage: string;
}

export default function ClientProvider({
  children,
  initialLanguage,
}: ClientProviderProps) {
  return (
    <i18n.I18nProvider
      languageManagerOptions={{
        defaultLanguage: "ko",
        availableLanguages: [
          { code: "ko", name: "한국어", flag: "🇰🇷" },
          { code: "en", name: "English", flag: "🇺🇸" },
        ],
      }}
      initialLanguage={initialLanguage}
    >
      {children}
    </i18n.I18nProvider>
  );
}
