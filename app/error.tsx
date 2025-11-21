"use client";

import { useEffect } from "react";
import { useTranslation } from "i18nexus";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { t } = useTranslation();

  useEffect(() => {
    // 에러 로깅 (선택사항)
    console.error("Application error:", error);
  }, [error]);

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-2xl w-full">
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl border border-red-900/50 p-8 md:p-12 shadow-2xl">
          {/* Error Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-lg shadow-red-500/50 animate-pulse">
              <span className="text-white text-4xl">⚠️</span>
            </div>
          </div>

          {/* Error Title */}
          <h1 className="text-3xl md:text-4xl font-bold text-center text-white mb-4">
            {t("오류가 발생했습니다")}
          </h1>

          {/* Error Message */}
          <p className="text-slate-400 text-center mb-6">
            {t("예상치 못한 문제가 발생했습니다. 잠시 후 다시 시도해주세요.")}
          </p>

          {/* Error Details (개발 환경에서만) */}
          {process.env.NODE_ENV === "development" && (
            <div className="bg-slate-950 rounded-lg p-4 mb-6 border border-slate-800">
              <p className="text-xs text-red-400 font-mono break-all">
                {error.message}
              </p>
              {error.digest && (
                <p className="text-xs text-slate-500 mt-2">
                  Digest: {error.digest}
                </p>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={reset}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold rounded-lg shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all hover:scale-105">
              <span className="mr-2">🔄</span>
              {t("다시 시도")}
            </button>
            <Link
              href="/"
              className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-lg border border-slate-700 transition-all hover:scale-105 text-center">
              <span className="mr-2">🏠</span>
              {t("홈으로 돌아가기")}
            </Link>
          </div>

          {/* Additional Help */}
          <div className="mt-8 pt-6 border-t border-slate-700">
            <p className="text-sm text-slate-500 text-center">
              {t("문제가 계속되면")}{" "}
              <Link
                href="https://github.com/your-repo/issues"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 underline">
                {t("이슈를 제보")}
              </Link>
              {t("해주세요.")}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
