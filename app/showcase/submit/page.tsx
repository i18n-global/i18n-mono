"use client";

import { useState } from "react";
import ProjectCard from "@/app/components/ProjectCard";
import { useError } from "@/app/components/GlobalErrorProvider";

interface MetadataPreview {
  autoTitle: string;
  autoDescription: string;
  thumbnailUrl: string;
  url: string;
}

export default function ShowcaseSubmitPage() {
  const { setError } = useError();
  const [url, setUrl] = useState("");
  const [projectName, setProjectName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<MetadataPreview | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleGeneratePreview = async () => {
    if (!url) return;

    setLoading(true);
    setPreview(null);

    try {
      const response = await fetch("/api/metadata", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      let data;
      try {
        data = await response.json();
      } catch (jsonError) {
        console.error("JSON parsing error:", jsonError);
        throw new Error(
          "서버 응답을 처리할 수 없습니다. 잠시 후 다시 시도해주세요."
        );
      }

      if (!response.ok) {
        // API에서 반환한 에러 메시지 사용
        const errorMessage = data.error || "Failed to fetch metadata";
        const errorDetails = data.details ? ` (${data.details})` : "";
        throw new Error(errorMessage + errorDetails);
      }

      setPreview(data);
    } catch (error: unknown) {
      console.error("Preview generation error:", error);
      const errorObj = error as { message?: string };
      const errorMessage = errorObj.message || "미리보기 생성에 실패했습니다.";

      // 사용자 친화적 에러 메시지
      if (errorMessage.includes("Invalid URL")) {
        setError(
          "올바르지 않은 URL 형식입니다. https:// 로 시작하는 전체 URL을 입력해주세요."
        );
      } else if (
        errorMessage.includes("JSON") ||
        errorMessage.includes("처리할 수 없습니다")
      ) {
        setError(
          "서버 응답을 처리할 수 없습니다. URL이 올바른지 확인하고 다시 시도해주세요."
        );
      } else if (errorMessage.includes("요청 한도")) {
        setError(
          "메타데이터 서비스의 요청 한도를 초과했습니다. 잠시 후 다시 시도해주세요."
        );
      } else if (errorMessage.includes("접근할 수 없습니다")) {
        setError(
          "URL에 접근할 수 없습니다. 공개 접근 가능한 URL인지 확인해주세요."
        );
      } else if (
        errorMessage.includes("external service") ||
        errorMessage.includes("메타데이터 서비스") ||
        errorMessage.includes("예상치 못한 응답")
      ) {
        setError(
          "메타데이터 서비스에 일시적인 문제가 있습니다. 잠시 후 다시 시도해주세요."
        );
      } else if (
        errorMessage.includes("aborted") ||
        errorMessage.includes("timeout")
      ) {
        setError(
          "요청 시간이 초과되었습니다. 네트워크 연결을 확인하고 다시 시도해주세요."
        );
      } else {
        setError(`미리보기 생성 실패: ${errorMessage}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!preview || !agreed) return;

    setSubmitting(true);

    try {
      const response = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url,
          projectName: projectName || null,
          autoTitle: preview.autoTitle,
          autoDescription: preview.autoDescription,
          thumbnailUrl: preview.thumbnailUrl,
          contactEmail: contactEmail || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMessage = data.error || "Failed to submit";
        throw new Error(errorMessage);
      }

      setSubmitted(true);
      // Reset form
      setTimeout(() => {
        setUrl("");
        setProjectName("");
        setContactEmail("");
        setAgreed(false);
        setPreview(null);
        setSubmitted(false);
      }, 3000);
    } catch (error) {
      console.error("Submission error:", error);
      setError("제출에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700 rounded-3xl mb-8 shadow-lg shadow-blue-500/50">
          <span className="text-white font-bold text-3xl">📝</span>
        </div>
        <h1 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-500 to-indigo-600 mb-4">
          Showcase 등록하기
        </h1>
        <p className="text-lg text-slate-300 max-w-2xl mx-auto">
          i18nexus를 사용하는 프로젝트를 공유하고 커뮤니티에 영감을 주세요
        </p>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl border border-slate-700 p-8 shadow-2xl">
        {/* URL Input */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-slate-300 mb-2">
            🔗 프로젝트 URL (필수)
          </label>
          <div className="flex gap-3">
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://myproject.vercel.app"
              className="flex-1 bg-slate-950 border border-slate-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              required
            />
            <button
              type="button"
              onClick={handleGeneratePreview}
              disabled={!url || loading}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105 shadow-lg shadow-blue-500/30 whitespace-nowrap">
              {loading ? "⏳ 로딩..." : "미리보기 ▶"}
            </button>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            URL을 입력하면 자동으로 제목, 설명, 썸네일을 추출합니다
          </p>
        </div>

        {/* Project Name (Optional Override) */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-slate-300 mb-2">
            📛 프로젝트 이름 (선택)
          </label>
          <input
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            placeholder="자동 수집된 제목을 변경하려면 입력하세요"
            className="w-full bg-slate-950 border border-slate-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
          <p className="text-xs text-slate-500 mt-2">
            입력하지 않으면 자동 추출된 제목을 사용합니다
          </p>
        </div>

        {/* Contact Email (Optional) */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-slate-300 mb-2">
            📧 연락처 이메일 (선택)
          </label>
          <input
            type="email"
            value={contactEmail}
            onChange={(e) => setContactEmail(e.target.value)}
            placeholder="example@gmail.com"
            className="w-full bg-slate-950 border border-slate-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
          <p className="text-xs text-slate-500 mt-2">
            승인 알림을 받으려면 이메일을 입력하세요
          </p>
        </div>

        {/* Preview Card */}
        {preview && (
          <div className="mb-8 p-6 bg-slate-950/50 border border-slate-700 rounded-xl">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <span className="mr-2">👁️</span>
              자동 미리보기
            </h3>
            <ProjectCard
              url={preview.url}
              projectName={projectName}
              autoTitle={preview.autoTitle}
              autoDescription={preview.autoDescription}
              thumbnailUrl={preview.thumbnailUrl}
            />
          </div>
        )}

        {/* Agreement Checkbox */}
        <div className="mb-8 p-4 bg-blue-950/30 border border-blue-800/50 rounded-xl">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-1 w-5 h-5 text-blue-600 bg-slate-800 border-slate-600 rounded focus:ring-2 focus:ring-blue-500"
              required
            />
            <span className="text-sm text-slate-300 leading-relaxed">
              위 정보 제공에 동의하며, i18nexus 쇼케이스에 공개될 수 있음을
              이해합니다. 관리자 검토 후 공개됩니다. (필수)
            </span>
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!preview || !agreed || submitting}
          className="w-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white py-4 rounded-xl font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105 shadow-lg shadow-green-500/30">
          {submitting ? "제출 중..." : "🚀 제출하기"}
        </button>

        {/* Success Message */}
        {submitted && (
          <div className="mt-6 p-4 bg-green-900/50 border border-green-700 text-green-100 rounded-xl text-center">
            <div className="flex items-center justify-center mb-2">
              <span className="text-2xl mr-2">✅</span>
              <span className="font-semibold">제출 완료!</span>
            </div>
            <p className="text-sm">검토 후 공개됩니다 😊</p>
          </div>
        )}
      </form>

      {/* Help Section */}
      <div className="mt-12 bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl border border-slate-700 p-8">
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
          <span className="mr-2">💡</span>
          제출 팁
        </h2>
        <ul className="space-y-3 text-slate-300">
          <li className="flex items-start">
            <span className="text-blue-400 mr-3 mt-0.5">•</span>
            <span>
              <strong className="text-white">공개 접근 가능한 URL</strong>을
              사용하세요 (localhost, 127.0.0.1 불가)
            </span>
          </li>
          <li className="flex items-start">
            <span className="text-blue-400 mr-3 mt-0.5">•</span>
            <span>
              <strong className="text-white">전체 URL</strong>을 입력하세요 (예:
              https://example.com)
            </span>
          </li>
          <li className="flex items-start">
            <span className="text-blue-400 mr-3 mt-0.5">•</span>
            <span>
              프로젝트에{" "}
              <strong className="text-white">Open Graph 메타 태그</strong>가
              있으면 더 좋은 썸네일을 얻을 수 있습니다
            </span>
          </li>
          <li className="flex items-start">
            <span className="text-blue-400 mr-3 mt-0.5">•</span>
            <span>제출 후 관리자 검토를 거쳐 24시간 이내에 공개됩니다</span>
          </li>
          <li className="flex items-start">
            <span className="text-blue-400 mr-3 mt-0.5">•</span>
            <span>
              미리보기 생성이 실패하면{" "}
              <strong className="text-white">URL을 다시 확인</strong>하거나 잠시
              후 다시 시도해주세요
            </span>
          </li>
        </ul>
      </div>
    </main>
  );
}
