"use client";

import { I18nProvider, useTranslation } from "i18nexus";
import { ReactNode } from "react";
import "@/lib/i18n.client"; // 클라이언트 전용 i18next 초기화

export default function ClientProvider({
  children
}: {
  children: ReactNode;
}) {
  const {
    t
  } = useTranslation();
  return <I18nProvider languageManagerOptions={{
    defaultLanguage: "ko",
    availableLanguages: [{
      code: "ko",
      name: String(t("한국어")),
      flag: "🇰🇷"
    }, {
      code: "en",
      name: "English",
      flag: "🇺🇸"
    }],
    enableAutoDetection: false // Hydration 에러 방지
  }}>
      {children}
    </I18nProvider>;
}