"use client";import { useTranslation } from "i18nexus";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/app/_shared/lib";
import { ProjectManageCard } from "@/app/_features/project-manage";
import { signOut } from "@/app/_features/auth-login";
import { approveProject, deleteProject } from "@/app/_features/project-manage";
import { useError } from "@/app/_shared/ui";

interface Submission {
  id: string;
  url: string;
  projectName: string | null;
  autoTitle: string;
  autoDescription: string;
  thumbnailUrl: string;
  screenshotUrl?: string | null;
  contactEmail: string | null;
  approved: boolean;
  submittedAt: {seconds: number;};
}

export default function AdminDashboardPage() {const { t } = useTranslation();
  const { setError } = useError();
  const [user, setUser] = useState<unknown>(null);
  const [loading, setLoading] = useState(true);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [filter, setFilter] = useState<"pending" | "approved" | "all">(
    "pending"
  );
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        setLoading(false);
      } else {
        router.push("/admin/login");
      }
    });

    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    if (user) {
      fetchSubmissions();
    }
  }, [user, filter]);

  const fetchSubmissions = async () => {
    try {
      const approvedParam =
      filter === "pending" ? "false" : filter === "approved" ? "true" : "";
      const url =
      filter === "all" ?
      "/api/submissions" :
      `/api/submissions?approved=${approvedParam}`;

      const response = await fetch(url);
      const data = await response.json();

      // 배열 검증: API가 에러 객체를 반환할 수 있음
      if (Array.isArray(data)) {
        setSubmissions(data);
      } else {
        console.error("API returned non-array data:", data);
        setSubmissions([]);

        // 에러 메시지 표시
        if (data.code === "FIRESTORE_INDEX_REQUIRED") {
          // 인덱스 생성 링크가 있으면 표시
          const message = data.indexUrl ?
          `Firestore 인덱스가 필요합니다. 링크를 클릭하여 생성해주세요: ${data.indexUrl}` :
          data.error;
          setError(message);

          // 콘솔에도 링크 출력
          if (data.indexUrl) {
            console.log(t("🔗 Firestore 인덱스 생성 링크:"), data.indexUrl);
          }
        } else if (data.code === "FIRESTORE_NOT_CONFIGURED") {
          setError(t("Firestore Database가 설정되지 않았습니다. FIREBASE_QUICK_SETUP.md를 참고하세요.")

          );
        } else {
          setError(data.error || t("제출 목록을 불러오는데 실패했습니다."));
        }
      }
    } catch (error) {
      console.error("Failed to fetch submissions:", error);
      setSubmissions([]);
      setError(t("제출 목록을 불러오는데 실패했습니다."));
    }
  };

  const handleApprove = async (id: string) => {
    try {
      await approveProject(id);
      fetchSubmissions();
    } catch (error) {
      console.error("Failed to approve:", error);
      setError(t("승인 중 오류가 발생했습니다."));
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t("정말 삭제하시겠습니까?"))) return;

    try {
      await deleteProject(id);
      fetchSubmissions();
    } catch (error) {
      console.error("Failed to delete:", error);
      setError(t("삭제 중 오류가 발생했습니다."));
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      router.push("/admin/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-2xl text-slate-300 animate-pulse">{t("⏳ 로딩 중...")}

        </div>
      </main>);

  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-12">
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-purple-500 to-pink-600 mb-2">{t("관리자 대시보드")}

          </h1>
          <p className="text-slate-400">{t("Showcase 제출 관리")}</p>
        </div>
        <button
          onClick={handleLogout}
          className="bg-gradient-to-r from-slate-700 to-slate-600 hover:from-slate-600 hover:to-slate-500 text-white px-6 py-3 rounded-xl font-semibold transition-all hover:scale-105 shadow-lg">{t("🚪 로그아웃")}

        </button>
      </div>

      {/* Filter Tabs */}
      <div className="mb-8 flex flex-wrap gap-3">
        <button
          onClick={() => setFilter("pending")}
          className={`px-6 py-3 rounded-xl font-semibold transition-all ${
          filter === "pending" ?
          "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30" :
          "bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 text-slate-300 hover:border-blue-500"}`
          }>{t("⏳ 승인 대기 중")}

        </button>
        <button
          onClick={() => setFilter("approved")}
          className={`px-6 py-3 rounded-xl font-semibold transition-all ${
          filter === "approved" ?
          "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30" :
          "bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 text-slate-300 hover:border-blue-500"}`
          }>{t("✅ 승인됨")}

        </button>
        <button
          onClick={() => setFilter("all")}
          className={`px-6 py-3 rounded-xl font-semibold transition-all ${
          filter === "all" ?
          "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30" :
          "bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 text-slate-300 hover:border-blue-500"}`
          }>{t("📋 전체")}

        </button>
      </div>

      {/* Stats */}
      <div className="mb-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl border border-slate-700 p-6">
          <div className="text-3xl font-bold text-blue-400">
            {submissions.length}
          </div>
          <div className="text-slate-400 text-sm mt-1">
            {filter === "pending" ? t("대기 중") :

            filter === "approved" ? t("승인됨") : t("전체 제출")

            }
          </div>
        </div>
      </div>

      {/* Submissions Grid */}
      {submissions.length === 0 ?
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl border border-slate-700 p-12 text-center">
          <div className="text-6xl mb-4">📭</div>
          <p className="text-xl text-slate-300 font-semibold mb-2">{t("제출된 프로젝트가 없습니다")}

        </p>
          <p className="text-slate-500">
            {filter === "pending" && t("승인 대기 중인 프로젝트가 없습니다")}
            {filter === "approved" && t("승인된 프로젝트가 없습니다")}
            {filter === "all" && t("아직 제출된 프로젝트가 없습니다")}
          </p>
        </div> :

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {submissions.map((submission) =>
        <div key={submission.id} className="relative">
              <ProjectManageCard
            url={submission.url}
            projectName={submission.projectName}
            autoTitle={submission.autoTitle}
            autoDescription={submission.autoDescription}
            thumbnailUrl={submission.thumbnailUrl}
            screenshotUrl={submission.screenshotUrl}
            isApproved={submission.approved}
            onApprove={!submission.approved ? () => handleApprove(submission.id) : undefined}
            onDelete={() => handleDelete(submission.id)} />

              {submission.approved &&
          <div className="absolute top-4 right-4 bg-gradient-to-r from-green-500 to-green-400 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg shadow-green-500/30 z-10">{t("✓ 승인됨")}

          </div>
          }
              {submission.contactEmail &&
          <div className="mt-3 px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-xs text-slate-400">
                  📧 {submission.contactEmail}
                </div>
          }
            </div>
        )}
        </div>
      }
    </main>);

}