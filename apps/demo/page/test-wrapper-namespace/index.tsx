"use client";

import { i18n } from "@/locales";

// Test file for i18n-wrapper namespace test
export default function TestPage() {
  const { t } = i18n.useTranslation();
  return (
    <div>
      <h1>{t("테스트 페이지" as any)}</h1>
      <p>{t("이것은 테스트입니다" as any)}</p>
      <button>{t("클릭하세요" as any)}</button>
    </div>
  );
}
