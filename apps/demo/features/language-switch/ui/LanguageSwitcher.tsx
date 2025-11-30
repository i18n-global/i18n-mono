"use client";

import { usePathname } from "next/navigation";

import { i18n } from "@/locales";

export default function LanguageSwitcher() {
  const { currentLanguage } = i18n.useTranslation();
  const availableLanguages = i18n.getAvailableLanguages();
  const pathname = usePathname();

  // 서버 컴포넌트 페이지 목록 (새로고침 필요)
  const serverComponentPages = ["/server-example"];

  const handleLanguageChange = async (langCode: string) => {
    // 서버 컴포넌트 페이지인 경우 새로고침 활성화
    const shouldReload = serverComponentPages.some((path) =>
      pathname?.startsWith(path),
    );
    await i18n.changeLanguage(langCode, { reload: shouldReload });
  };

  return (
    <div className="hidden sm:flex items-center space-x-3">
      {availableLanguages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => handleLanguageChange(lang.code)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
            currentLanguage === lang.code
              ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
              : "bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 border border-slate-700"
          }`}
        >
          <span className="mr-1.5">{lang.flag}</span>
          {lang.name}
        </button>
      ))}
    </div>
  );
}
