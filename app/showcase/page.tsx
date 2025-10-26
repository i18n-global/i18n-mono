import ProjectCard from "@/app/components/ProjectCard";
import Link from "next/link";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { getServerTranslations, getServerLanguage } from "i18nexus/server";
import { headers } from "next/headers";
import { translations } from "@/lib/i18n";

interface Submission {
  id: string;
  url: string;
  projectName: string | null;
  autoTitle: string;
  autoDescription: string;
  thumbnailUrl: string;
  screenshotUrl?: string | null;
  approved: boolean;
}

async function getApprovedProjects(): Promise<Submission[]> {
  try {
    const q = query(
      collection(db, "submissions"),
      where("approved", "==", true),
      orderBy("submittedAt", "desc")
    );

    const querySnapshot = await getDocs(q);
    const submissions = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    })) as Submission[];

    return submissions;
  } catch (error) {
    console.error("Failed to fetch projects:", error);
    return [];
  }
}

// ISR을 비활성화하고 On-Demand Revalidation만 사용
// 데이터 변경(추가/삭제/수정) 시에만 재검증
export const revalidate = false;

export default async function ShowcasePage() {
  const headersList = await headers();
  const language = getServerLanguage(headersList);
  const t = await getServerTranslations(language, translations);
  const projects = await getApprovedProjects();

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Header */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700 rounded-3xl mb-8 shadow-lg shadow-blue-500/50">
          <span className="text-white font-bold text-3xl">🌍</span>
        </div>
        <h1 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-500 to-indigo-600 mb-6">
          {t[t("i18nexus 쇼케이스")] || t("i18nexus 쇼케이스")}
        </h1>
        <p className="text-xl md:text-2xl text-slate-300 mb-8 max-w-3xl mx-auto">
          {t[t("i18nexus와 i18nexus-tools를 사용하는 실제 프로젝트들")] || t("i18nexus와 i18nexus-tools를 사용하는 실제 프로젝트들")
          }
        </p>
        <Link
          href="/showcase/submit"
          className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-lg rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all hover:scale-105">
          <span className="mr-3 text-2xl">📝</span>
          {t[t("내 프로젝트 등록하기")] || t("내 프로젝트 등록하기")}
          <span className="ml-3">→</span>
        </Link>
      </div>

      {/* Projects Grid */}
      {projects.length === 0 ?
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl border border-slate-700 p-12 text-center">
          <div className="w-20 h-20 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-5xl">📦</span>
          </div>
          <h3 className="text-2xl font-bold text-white mb-3">
            {t[t("아직 등록된 프로젝트가 없습니다")] || t("아직 등록된 프로젝트가 없습니다")
          }
          </h3>
          <p className="text-slate-400 mb-8">
            {t[t("첫 번째 프로젝트를 등록하고 커뮤니티에 공유해보세요!")] || t("첫 번째 프로젝트를 등록하고 커뮤니티에 공유해보세요!")
          }
          </p>
          <Link
          href="/showcase/submit"
          className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg transition-colors">
            {t[t("첫 번째 프로젝트 등록하기")] || t("첫 번째 프로젝트 등록하기")} →
          </Link>
        </div> :

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) =>
        <ProjectCard
          key={project.id}
          url={project.url}
          projectName={project.projectName}
          autoTitle={project.autoTitle}
          autoDescription={project.autoDescription}
          thumbnailUrl={project.thumbnailUrl}
          screenshotUrl={project.screenshotUrl} />

        )}
        </div>
      }
    </main>);

}