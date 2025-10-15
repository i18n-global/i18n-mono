"use client";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./translations/en.json";
import ko from "./translations/ko.json";

// i18next 초기화 (클라이언트 전용)
if (typeof window !== "undefined" && !i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    resources: {
      ko: { translation: ko },
      en: { translation: en },
    },
    lng: "ko",
    fallbackLng: "ko",
    interpolation: {
      escapeValue: false,
    },
  });
}

export default i18n;
