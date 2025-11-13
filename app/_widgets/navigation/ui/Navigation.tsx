"use client";

import { useTranslation } from "i18nexus";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { LanguageSwitcher } from "@/app/_features/language-switch";

export default function Navigation() {
  const { t } = useTranslation();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [cliExpanded, setCliExpanded] = useState(false);
  const [docsExpanded, setDocsExpanded] = useState(false);

  // 현재 선택된 섹션 확인
  const isCliSelected =
    pathname === "/cli" || pathname?.startsWith("/docs/i18nexus-tools");
  const isDocsSelected =
    pathname?.startsWith("/docs/i18nexus") &&
    !pathname?.startsWith("/docs/i18nexus-tools");

  // 페이지 이동 시 확장 상태 유지
  useEffect(() => {
    if (isCliSelected && !cliExpanded) {
      setCliExpanded(true);
    }
    if (isDocsSelected && !docsExpanded) {
      setDocsExpanded(true);
    }
  }, [pathname, isCliSelected, isDocsSelected, cliExpanded, docsExpanded]);

  // 사이드바 열릴 때 body에 padding 적용
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.paddingLeft = '256px';
    } else {
      document.body.style.paddingLeft = '0';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.paddingLeft = '0';
    };
  }, [sidebarOpen]);

  const navItems = [
    {
      href: "/",
      label: t("홈"),
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      href: "/getting-started",
      label: t("시작하기"),
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
    },
    {
      href: "/server-example",
      label: t("서버 예제"),
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
        </svg>
      ),
    },
    {
      href: "/showcase",
      label: t("쇼케이스"),
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      href: "/showcase/submit",
      label: t("프로젝트 등록"),
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
  ];

  const cliItems = [
    {
      href: "/cli",
      label: t("CLI 개요"),
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
    },
    {
      href: "/docs/i18nexus-tools/wrapper",
      label: "wrapper",
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
    {
      href: "/docs/i18nexus-tools/extractor",
      label: "extractor",
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      ),
    },
    {
      href: "/docs/i18nexus-tools/upload",
      label: "upload",
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
      ),
    },
    {
      href: "/docs/i18nexus-tools/download",
      label: "download",
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
        </svg>
      ),
    },
    {
      href: "/docs/i18nexus-tools/download-force",
      label: "download-force",
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      ),
    },
    {
      href: "/docs/i18nexus-tools/google-sheets",
      label: "Google Sheets",
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
    },
  ];

  const docsItems = [
    {
      href: "/docs/i18nexus",
      label: t("문서 개요"),
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
    },
    {
      href: "/docs/i18nexus/provider",
      label: "Provider",
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
        </svg>
      ),
    },
    {
      href: "/docs/i18nexus/use-translation",
      label: "useTranslation",
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
        </svg>
      ),
    },
  ];

  return (
    <>
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full bg-slate-900 border-r border-slate-800 z-50 transition-all duration-300 ease-in-out ${
          sidebarOpen ? "w-64" : "w-0"
        } overflow-hidden`}>
        <div className="flex flex-col h-full w-64">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-4 border-b border-slate-800">
            <Link
              href="/"
              className="flex items-center space-x-2"
              onClick={() => setSidebarOpen(false)}>
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xs">i18</span>
              </div>
              <span className="text-lg font-bold text-blue-400">
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
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Sidebar Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            <div className="space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                    pathname === item.href
                      ? "bg-blue-600 text-white shadow-lg"
                      : "text-slate-400 hover:text-white hover:bg-slate-800"
                  }`}>
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>

            {/* CLI Section with Dropdown */}
            <div className="mt-8 pt-8 border-t border-slate-800">
              <h3 className="px-4 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {t("문서")}
              </h3>
              <div className="space-y-1">
                {/* CLI Menu with Dropdown */}
                <div className="relative">
                  <div className="flex items-stretch">
                    <Link
                      href="/cli"
                      onClick={() => setSidebarOpen(false)}
                      className={`flex-1 flex items-center space-x-3 px-4 py-3 rounded-l-lg text-sm font-medium transition-all ${
                        isCliSelected
                          ? "bg-indigo-600 text-white shadow-lg"
                          : "text-slate-400 hover:text-white hover:bg-slate-800"
                      }`}>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>{t("CLI")}</span>
                    </Link>
                    <button
                      onClick={() => setCliExpanded(!cliExpanded)}
                      className={`flex items-center justify-center px-3 rounded-r-lg text-sm font-medium transition-all ${
                        isCliSelected
                          ? "bg-indigo-600 text-white shadow-lg"
                          : "text-slate-400 hover:text-white hover:bg-slate-800"
                      }`}>
                      <svg
                        className={`w-4 h-4 transition-transform duration-300 ${
                          cliExpanded || isCliSelected ? "rotate-90" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>
                  </div>

                  {/* CLI Dropdown */}
                  <div
                    className={`ml-4 mt-1 space-y-1 border-l-2 border-indigo-500 pl-4 overflow-hidden transition-all duration-300 ${
                      cliExpanded || isCliSelected ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                    }`}>
                    {cliItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setSidebarOpen(false)}
                        className="group flex items-center space-x-3 px-4 py-2 rounded-lg text-sm font-medium transition-all text-slate-400 hover:text-white hover:bg-slate-800">
                        {item.icon}
                        <span
                          className={
                            pathname === item.href
                              ? "underline underline-offset-2 text-white font-semibold"
                              : "group-hover:underline underline-offset-2"
                          }>
                          {item.label}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Provider Menu with Dropdown */}
                <div className="relative">
                  <div className="flex items-stretch">
                    <Link
                      href="/docs/i18nexus"
                      onClick={() => setSidebarOpen(false)}
                      className={`flex-1 flex items-center space-x-3 px-4 py-3 rounded-l-lg text-sm font-medium transition-all ${
                        isDocsSelected
                          ? "bg-blue-600 text-white shadow-lg"
                          : "text-slate-400 hover:text-white hover:bg-slate-800"
                      }`}>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                      <span>{t("Provider")}</span>
                    </Link>
                    <button
                      onClick={() => setDocsExpanded(!docsExpanded)}
                      className={`flex items-center justify-center px-3 rounded-r-lg text-sm font-medium transition-all ${
                        isDocsSelected
                          ? "bg-blue-600 text-white shadow-lg"
                          : "text-slate-400 hover:text-white hover:bg-slate-800"
                      }`}>
                      <svg
                        className={`w-4 h-4 transition-transform duration-300 ${
                          docsExpanded || isDocsSelected ? "rotate-90" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>
                  </div>

                  {/* Provider Dropdown */}
                  <div
                    className={`ml-4 mt-1 space-y-1 border-l-2 border-blue-500 pl-4 overflow-hidden transition-all duration-300 ${
                      docsExpanded || isDocsSelected ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                    }`}>
                    {docsItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setSidebarOpen(false)}
                        className="group flex items-center space-x-3 px-4 py-2 rounded-lg text-sm font-medium transition-all text-slate-400 hover:text-white hover:bg-slate-800">
                        {item.icon}
                        <span
                          className={
                            pathname === item.href
                              ? "underline underline-offset-2 text-white font-semibold"
                              : "group-hover:underline underline-offset-2"
                          }>
                          {item.label}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
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
                    pathname === "/admin/login"
                      ? "bg-blue-600 text-white shadow-lg"
                      : "text-slate-400 hover:text-white hover:bg-slate-800"
                  }`}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <span>{t("관리자 로그인")}</span>
                </Link>
                <Link
                  href="/admin/dashboard"
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                    pathname === "/admin/dashboard"
                      ? "bg-blue-600 text-white shadow-lg"
                      : "text-slate-400 hover:text-white hover:bg-slate-800"
                  }`}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <span>{t("대시보드")}</span>
                </Link>
              </div>
            </div>
          </nav>
        </div>
      </aside>

      {/* Top Navigation Bar */}
      <nav className="bg-slate-900/95 backdrop-blur-sm border-b border-slate-800 sticky top-0 z-30 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              {/* Hamburger Menu Button */}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="text-white hover:text-blue-400 transition-all duration-300 p-2 hover:bg-slate-800 rounded-lg flex items-center justify-center"
                aria-label="Toggle menu"
                title={sidebarOpen ? t("닫기") : t("메뉴 열기")}>
                <svg
                  className={`w-7 h-7 transition-transform duration-300 ${sidebarOpen ? "rotate-90" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d={sidebarOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                  />
                </svg>
              </button>

              {/* Logo */}
              <Link href="/" className="flex items-center space-x-3 group">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:shadow-blue-500/50 transition-all group-hover:scale-110">
                  <span className="text-white font-bold text-sm">i18</span>
                </div>
                <h1 className="text-xl font-bold text-blue-400">
                  i18nexus
                </h1>
              </Link>
            </div>

            {/* Language Switcher */}
            <LanguageSwitcher />
          </div>
        </div>
      </nav>
    </>
  );
}
