"use client";

import { useLanguageSwitcher, useTranslation } from "i18nexus";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function Header() {const { t } = useTranslation();
  const { currentLanguage, changeLanguage, availableLanguages } =
  useLanguageSwitcher();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
  { href: "/", label: t("홈"), emoji: "🏠" },
  { href: "/getting-started", label: t("시작하기"), emoji: "🚀" },
  { href: "/provider", label: t("Provider"), emoji: "🎨" },
  { href: "/cli", label: t("CLI 도구"), emoji: "⚡" },
  { href: "/server-example", label: t("서버 예제"), emoji: "🖥️" },
  { href: "/showcase", label: t("쇼케이스"), emoji: "🌍" },
  { href: "/showcase/submit", label: t("프로젝트 등록"), emoji: "📝" }];


  return (
    <>
      {/* Sidebar Overlay */}
      {sidebarOpen &&
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        onClick={() => setSidebarOpen(false)} />

      }

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-slate-900 border-r border-slate-800 z-50 transform transition-transform duration-300 ease-in-out ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"}`
        }>
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-4 border-b border-slate-800">
            <Link
              href="/"
              className="flex items-center space-x-2"
              onClick={() => setSidebarOpen(false)}>
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xs">i18</span>
              </div>
              <span className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">
                i18nexus
              </span>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="text-white hover:text-blue-400 transition-colors p-1"
              aria-label="Close menu">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M6 18L18 6M6 6l12 12" />

              </svg>
            </button>
          </div>

          {/* Sidebar Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            <div className="space-y-1">
              {navItems.map((item) =>
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                pathname === item.href ?
                "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg" :
                "text-slate-400 hover:text-white hover:bg-slate-800"}`
                }>
                  <span className="text-xl">{item.emoji}</span>
                  <span>{item.label}</span>
                </Link>
              )}
            </div>

            {/* Admin Section */}
            <div className="mt-8 pt-8 border-t border-slate-800">
              <h3 className="px-4 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {t("관리자")}
              </h3>
              <div className="space-y-1">
                <Link
                  href="/admin/login"
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  pathname === "/admin/login" ?
                  "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg" :
                  "text-slate-400 hover:text-white hover:bg-slate-800"}`
                  }>
                  <span className="text-xl">🔐</span>
                  <span>{t("관리자 로그인")}</span>
                </Link>
                <Link
                  href="/admin/dashboard"
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  pathname === "/admin/dashboard" ?
                  "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg" :
                  "text-slate-400 hover:text-white hover:bg-slate-800"}`
                  }>
                  <span className="text-xl">🎯</span>
                  <span>{t("대시보드")}</span>
                </Link>
              </div>
            </div>
          </nav>

          {/* Language Switcher in Sidebar */}
          <div className="p-4 border-t border-slate-800">
            <h3 className="px-4 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {t("언어")}
            </h3>
            <div className="space-y-2">
              {availableLanguages.map((lang) =>
              <button
                key={lang.code}
                onClick={() => changeLanguage(lang.code)}
                className={`w-full px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                currentLanguage === lang.code ?
                "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg" :
                "bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700"}`
                }>
                  <span className="mr-2">{lang.flag}</span>
                  {lang.name}
                </button>
              )}
            </div>
          </div>
        </div>
      </aside>

      {/* Top Navigation Bar */}
      <nav className="bg-slate-900/95 backdrop-blur-sm border-b border-slate-800 sticky top-0 z-30 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              {/* Hamburger Menu Button */}
              <button
                onClick={() => setSidebarOpen(true)}
                className="text-white hover:text-blue-400 transition-colors p-2 hover:bg-slate-800 rounded-lg flex items-center justify-center"
                aria-label="Open menu"
                title={t("메뉴 열기")}>
                <svg
                  className="w-7 h-7"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M4 6h16M4 12h16M4 18h16" />

                </svg>
              </button>

              {/* Logo */}
              <Link href="/" className="flex items-center space-x-3 group">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:shadow-blue-500/50 transition-all group-hover:scale-110">
                  <span className="text-white font-bold text-sm">i18</span>
                </div>
                <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">
                  i18nexus
                </h1>
              </Link>
            </div>

            {/* Language Switcher - Desktop */}
            <div className="hidden sm:flex items-center space-x-3">
              {availableLanguages.map((lang) =>
              <button
                key={lang.code}
                onClick={() => changeLanguage(lang.code)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                currentLanguage === lang.code ?
                "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30 scale-105" :
                "bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 border border-slate-700"}`
                }>
                  <span className="mr-1.5">{lang.flag}</span>
                  {lang.name}
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>);

}