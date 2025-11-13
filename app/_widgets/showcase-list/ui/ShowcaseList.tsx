import Link from "next/link";
import { ProjectCard } from "@/app/_entities/project";
import { getProjects } from "@/app/_entities/project";
import { createServerTranslation, getServerLanguage } from "i18nexus/server";
import { headers } from "next/headers";
import { translations } from "@/locales";

export default async function ShowcaseList() {
  const headersList = await headers();
  const language = getServerLanguage(headersList);
  const t = createServerTranslation(language, translations);

  // Get only approved projects
  const projects = await getProjects(true);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Header */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700 rounded-3xl mb-8 shadow-lg shadow-blue-500/50">
          <span className="text-white font-bold text-3xl">🌍</span>
        </div>
        <h1 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-500 to-indigo-600 mb-6">
          {t("i18nexus 쇼케이스")}
        </h1>
        <p className="text-xl md:text-2xl text-slate-300 mb-8 max-w-3xl mx-auto">
          {t("i18nexus와 i18nexus-tools를 사용하는 실제 프로젝트들")}
        </p>
        <Link
          href="/showcase/submit"
          className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-lg rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all hover:scale-105">
          <span className="mr-3 text-2xl">📝</span>
          {t("내 프로젝트 등록하기")}
          <span className="ml-3">→</span>
        </Link>
      </div>

      {/* Projects Grid */}
      {projects.length === 0 ? (
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl border border-slate-700 p-12 text-center">
          <div className="w-20 h-20 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-5xl">📦</span>
          </div>
          <h3 className="text-2xl font-bold text-white mb-3">
            {t("아직 등록된 프로젝트가 없습니다")}
          </h3>
          <p className="text-slate-400 mb-8">
            {t("첫 번째 프로젝트를 등록하고 커뮤니티에 공유해보세요!")}
          </p>
          <Link
            href="/showcase/submit"
            className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg transition-colors">
            {t("첫 번째 프로젝트 등록하기")} →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              url={project.url}
              projectName={project.projectName}
              autoTitle={project.autoTitle}
              autoDescription={project.autoDescription}
              thumbnailUrl={project.thumbnailUrl}
              screenshotUrl={project.screenshotUrl}
            />
          ))}
        </div>
      )}
    </main>
  );
}
