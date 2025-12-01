"use client";

import { useTranslation } from "i18nexus";

export default function TypeErrorTestPage() {
  const { t } = useTranslation<"docs-i18nexus-server-components">("docs-i18nexus-server-components");

  return (
    <div>
      {/* ❌ This SHOULD cause a type error */}
      <h1>{t("완전한 예제 압")}</h1>
      
      {/* ✅ This should be fine */}
      <h2>{t("완전한 예제")}</h2>
    </div>
  );
}

