"use client";

import { useTranslation } from "i18nexus";
import { ProjectManageCard } from "@/app/_features/project-manage";
import { useAdminDashboard } from "../model";

export default function AdminDashboard() {
  const { t } = useTranslation();
  const {
    loading,
    submissions,
    filter,
    setFilter,
    handleApprove,
    handleDelete,
    handleLogout,
  } = useAdminDashboard();

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-2xl text-slate-300 animate-pulse">
          {t("⏳ 로딩 중...")}
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 mb-8 sm:mb-12">
        <div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-purple-500 to-pink-600 mb-1 sm:mb-2">
            {t("관리자 대시보드")}
          </h1>
          <p className="text-sm sm:text-base text-slate-400">{t("Showcase 제출 관리")}</p>
        </div>
        <button
          onClick={handleLogout}
          className="bg-gradient-to-r from-slate-700 to-slate-600 hover:from-slate-600 hover:to-slate-500 text-white px-5 py-2.5 sm:px-6 sm:py-3 rounded-lg sm:rounded-xl text-sm sm:text-base font-semibold transition-all hover:scale-105 shadow-lg">
          {t("🚪 로그아웃")}
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="mb-6 sm:mb-8 flex flex-wrap gap-2 sm:gap-3">
        <button
          onClick={() => setFilter("pending")}
          className={`px-4 py-2 sm:px-6 sm:py-3 rounded-lg sm:rounded-xl text-sm sm:text-base font-semibold transition-all ${
            filter === "pending"
              ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30"
              : "bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 text-slate-300 hover:border-blue-500"
          }`}>
          <span className="hidden sm:inline">{t("⏳ 승인 대기 중")}</span>
          <span className="sm:hidden">{t("⏳ 대기")}</span>
        </button>
        <button
          onClick={() => setFilter("approved")}
          className={`px-4 py-2 sm:px-6 sm:py-3 rounded-lg sm:rounded-xl text-sm sm:text-base font-semibold transition-all ${
            filter === "approved"
              ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30"
              : "bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 text-slate-300 hover:border-blue-500"
          }`}>
          {t("✅ 승인됨")}
        </button>
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 sm:px-6 sm:py-3 rounded-lg sm:rounded-xl text-sm sm:text-base font-semibold transition-all ${
            filter === "all"
              ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30"
              : "bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 text-slate-300 hover:border-blue-500"
          }`}>
          {t("📋 전체")}
        </button>
      </div>

      {/* Stats */}
      <div className="mb-6 sm:mb-8 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg sm:rounded-xl border border-slate-700 p-4 sm:p-6">
          <div className="text-2xl sm:text-3xl font-bold text-blue-400">
            {submissions.length}
          </div>
          <div className="text-slate-400 text-xs sm:text-sm mt-1">
            {filter === "pending"
              ? t("대기 중")
              : filter === "approved"
                ? t("승인됨")
                : t("전체 제출")}
          </div>
        </div>
      </div>

      {/* Submissions Grid */}
      {submissions.length === 0 ? (
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl sm:rounded-2xl border border-slate-700 p-8 sm:p-12 text-center">
          <div className="text-5xl sm:text-6xl mb-3 sm:mb-4">📭</div>
          <p className="text-lg sm:text-xl text-slate-300 font-semibold mb-2">
            {t("제출된 프로젝트가 없습니다")}
          </p>
          <p className="text-slate-500">
            {filter === "pending" && t("승인 대기 중인 프로젝트가 없습니다")}
            {filter === "approved" && t("승인된 프로젝트가 없습니다")}
            {filter === "all" && t("아직 제출된 프로젝트가 없습니다")}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {submissions.map((submission) => (
            <div key={submission.id} className="relative">
              <ProjectManageCard
                url={submission.url}
                projectName={submission.projectName}
                autoTitle={submission.autoTitle}
                autoDescription={submission.autoDescription}
                thumbnailUrl={submission.thumbnailUrl}
                screenshotUrl={submission.screenshotUrl}
                isApproved={submission.approved}
                onApprove={
                  !submission.approved
                    ? () => handleApprove(submission.id)
                    : undefined
                }
                onDelete={() => handleDelete(submission.id)}
              />

              {submission.approved && (
                <div className="absolute top-4 right-4 bg-gradient-to-r from-green-500 to-green-400 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg shadow-green-500/30 z-10">
                  {t("✓ 승인됨")}
                </div>
              )}
              {submission.contactEmail && (
                <div className="mt-3 px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-xs text-slate-400">
                  📧 {submission.contactEmail}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
