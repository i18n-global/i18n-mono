"use client";

import { useLanguageSwitcher } from "i18nexus";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const { currentLanguage, changeLanguage, availableLanguages } =
    useLanguageSwitcher();
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: "Home", emoji: "🏠" },
    { href: "/getting-started", label: "Getting Started", emoji: "🚀" },
    { href: "/provider", label: "Provider", emoji: "🎨" },
    { href: "/cli", label: "CLI", emoji: "⚡" },
    { href: "/server-example", label: "Server", emoji: "🖥️" },
  ];

  return (
    <nav className="bg-slate-900/95 backdrop-blur-sm border-b border-slate-800 sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:shadow-blue-500/50 transition-all group-hover:scale-110">
                <span className="text-white font-bold text-sm">i18</span>
              </div>
              <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">
                i18nexus
              </h1>
            </Link>

            {/* Navigation Links - Desktop */}
            <div className="hidden md:flex items-center space-x-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    pathname === item.href
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30"
                      : "text-slate-400 hover:text-white hover:bg-slate-800"
                  }`}>
                  <span className="mr-1.5">{item.emoji}</span>
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Language Switcher */}
          <div className="flex items-center space-x-3">
            {availableLanguages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => changeLanguage(lang.code)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  currentLanguage === lang.code
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30 scale-105"
                    : "bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 border border-slate-700"
                }`}>
                <span className="mr-1.5">{lang.flag}</span>
                {lang.name}
              </button>
            ))}
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden pb-4 border-t border-slate-800 pt-4 mt-2">
          <div className="flex flex-col space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  pathname === item.href
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
                    : "text-slate-400 hover:text-white hover:bg-slate-800"
                }`}>
                <span className="mr-2">{item.emoji}</span>
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
