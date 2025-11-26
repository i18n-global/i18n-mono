"use client";

import { useLanguageSwitcher } from "i18nexus";

export default function LanguageSwitcher() {
  const { currentLanguage, changeLanguage, availableLanguages } =
    useLanguageSwitcher();

  return (
    <div className="hidden sm:flex items-center space-x-3">
      {availableLanguages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => changeLanguage(lang.code)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
            currentLanguage === lang.code
              ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
              : "bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 border border-slate-700"
          }`}>
          <span className="mr-1.5">{lang.flag}</span>
          {lang.name}
        </button>
      ))}
    </div>
  );
}
