"use client";

import { useTranslation, useLanguageSwitcher } from "i18nexus";

// Test file for i18n-wrapper namespace test
export default function TestPage() {
  const { t } = useTranslation<"test-wrapper-namespace">("test-wrapper-namespace");
  return (
    <div>
      <h1>{t(t("\uD14C\uC2A4\uD2B8 \uD398\uC774\uC9C0") as any)}</h1>
      <p>{t(t("\uC774\uAC83\uC740 \uD14C\uC2A4\uD2B8\uC785\uB2C8\uB2E4") as any)}</p>
      <button>{t(t("\uD074\uB9AD\uD558\uC138\uC694") as any)}</button>
    </div>);

}