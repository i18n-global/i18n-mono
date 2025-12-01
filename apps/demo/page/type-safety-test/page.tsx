"use client";

/**
 * Type Safety Test Page
 * 
 * This page tests if the type-safe useTranslation hook
 * properly catches type errors for invalid translation keys.
 */

import { useTranslation } from "i18nexus";

export default function TypeSafetyTestPage() {
  // This should work with type-safe keys
  const { t } = useTranslation<"docs-i18nexus-server-components">("docs-i18nexus-server-components");

  return (
    <div className="min-h-screen bg-slate-950 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">
          Type Safety Test
        </h1>

        <div className="space-y-6">
          {/* ✅ Valid keys - should work */}
          <div className="bg-slate-900 rounded-lg p-6 border border-green-500">
            <h2 className="text-2xl text-green-400 mb-4">
              ✅ Valid Keys (Should Work)
            </h2>
            <div className="space-y-2 text-white">
              <p>{t("개요")}</p>
              <p>{t("완전한 예제")}</p>
              <p>{t("서버 번역 API")}</p>
            </div>
          </div>

          {/* ❌ Invalid keys - should show type errors */}
          <div className="bg-slate-900 rounded-lg p-6 border border-red-500">
            <h2 className="text-2xl text-red-400 mb-4">
              ❌ Invalid Keys (Should Show Type Errors)
            </h2>
            <div className="space-y-2 text-white">
              {/* @ts-expect-error - Testing invalid key */}
              <p>{t("완전한 예제 압")}</p>
              
              {/* @ts-expect-error - Testing invalid key */}
              <p>{t("존재하지_않는_키")}</p>
              
              {/* @ts-expect-error - Testing invalid key */}
              <p>{t("typo_key")}</p>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-blue-900/30 rounded-lg p-6 border border-blue-500">
          <h3 className="text-xl text-blue-300 mb-2">
            💡 How to Check Type Safety
          </h3>
          <ul className="text-slate-300 space-y-2">
            <li>1. Open this file in your IDE</li>
            <li>2. Hover over the <code className="bg-slate-800 px-2 py-1 rounded">t()</code> calls</li>
            <li>3. IDE should show red underlines for invalid keys</li>
            <li>4. Remove <code className="bg-slate-800 px-2 py-1 rounded">@ts-expect-error</code> comments to see errors</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

