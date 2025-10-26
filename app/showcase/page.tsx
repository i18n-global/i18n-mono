"use client";

import { useEffect, useState } from "react";
import ProjectCard from "@/app/components/ProjectCard";
import Link from "next/link";
import { useError } from "@/app/components/GlobalErrorProvider";

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

export default function ShowcasePage() {
  const { setError } = useError();
  const [projects, setProjects] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApprovedProjects();
  }, []);

  const fetchApprovedProjects = async () => {
    try {
      const response = await fetch("/api/submissions?approved=true");
      const data = await response.json();

      // 데이터가 배열인지 확인
      if (Array.isArray(data)) {
        setProjects(data);
      } else {
        console.error("Invalid data format:", data);
        setProjects([]);

        // 에러 메시지 표시
        if (data.code === "FIRESTORE_INDEX_REQUIRED") {
          const message = data.indexUrl
            ? `Firestore 인덱스가 필요합니다. 링크를 클릭하여 생성해주세요: ${data.indexUrl}`
            : data.error;
          setError(message);

          // 콘솔에도 링크 출력
          if (data.indexUrl) {
            console.log("🔗 Firestore 인덱스 생성 링크:", data.indexUrl);
          }
        } else if (data.code === "FIRESTORE_NOT_CONFIGURED") {
          setError(
            "Firestore Database가 설정되지 않았습니다. FIREBASE_QUICK_SETUP.md를 참고하세요."
          );
        } else if (data.error) {
          setError(data.error);
        }
      }
    } catch (error) {
      console.error("Failed to fetch projects:", error);
      setProjects([]);
      setError("프로젝트 목록을 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <div className="text-xl text-slate-300">로딩 중...</div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Header */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700 rounded-3xl mb-8 shadow-lg shadow-blue-500/50">
          <span className="text-white font-bold text-3xl">🌍</span>
        </div>
        <h1 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-500 to-indigo-600 mb-6">
          i18nexus Showcase
        </h1>
        <p className="text-xl md:text-2xl text-slate-300 mb-8 max-w-3xl mx-auto">
          i18nexus와 i18nexus-tools를 사용하는 실제 프로젝트들
        </p>
        <Link
          href="/showcase/submit"
          className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-lg rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all hover:scale-105">
          <span className="mr-3 text-2xl">📝</span>내 프로젝트 등록하기
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
            아직 등록된 프로젝트가 없습니다
          </h3>
          <p className="text-slate-400 mb-8">
            첫 번째 프로젝트를 등록하고 커뮤니티에 공유해보세요!
          </p>
          <Link
            href="/showcase/submit"
            className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg transition-colors">
            첫 번째 프로젝트 등록하기 →
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
