"use client";

import { I18nProvider } from "i18nexus";

import { loadNamespace } from "@/locales";
import {
  Analytics,
  FirebaseStatus,
  GlobalErrorProvider,
  ScrollRestorer,
} from "@/shared/ui";
import Navigation from "@/widgets/Navigation";

export function ClientProvider({
  children,
  language,
}: {
  children: React.ReactNode;
  language: string;
}) {
  return (
    <I18nProvider
      loadNamespace={loadNamespace}
      initialLanguage={language}
      fallbackNamespace="common"
      preloadNamespaces={["common", "home"]}
      languageManagerOptions={{
        defaultLanguage: "ko",
        availableLanguages: [
          { code: "ko", name: "한국어", flag: "🇰🇷" },
          { code: "en", name: "English", flag: "🇺🇸" },
        ],
        cookieName: "i18n-language",
        enableAutoDetection: true,
      }}>
      <GlobalErrorProvider>
        <ScrollRestorer />
        <Navigation />
        {children}
        <Analytics />
        <FirebaseStatus />
      </GlobalErrorProvider>
    </I18nProvider>
  );
}
