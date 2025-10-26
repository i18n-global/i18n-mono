"use client";

import { useState } from "react";

interface ProjectCardProps {
  url: string;
  projectName?: string | null;
  autoTitle: string;
  autoDescription: string;
  thumbnailUrl: string;
  screenshotUrl?: string | null;
  showActions?: boolean;
  isApproved?: boolean;
  onApprove?: () => void;
  onDelete?: () => void;
}

export default function ProjectCard({
  url,
  projectName,
  autoTitle,
  autoDescription,
  thumbnailUrl,
  screenshotUrl,
  showActions = false,
  isApproved = false,
  onApprove,
  onDelete,
}: ProjectCardProps) {
  const displayTitle = projectName || autoTitle;
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="group bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl border border-slate-700 hover:border-blue-500 overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 hover:-translate-y-1">
        {/* Thumbnail - 클릭 시 모달 열기 */}
        <div
          className="relative w-full h-48 bg-slate-950 overflow-hidden cursor-pointer group/image"
          onClick={(e) => {
            e.preventDefault();
            setIsModalOpen(true);
          }}>
          <img
            src={thumbnailUrl}
            alt={displayTitle}
            className="w-full h-full object-contain bg-slate-950 group-hover/image:scale-105 transition-transform duration-300"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/default-thumbnail.svg";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent pointer-events-none"></div>
          
          {/* 확대 아이콘 힌트 */}
          <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg text-xs font-medium opacity-0 group-hover/image:opacity-100 transition-opacity flex items-center gap-1.5">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
            </svg>
            이미지 확대
          </div>
        </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-white mb-2 line-clamp-2 group-hover:text-blue-400 transition-colors">
          {displayTitle}
        </h3>
        <p className="text-slate-400 text-sm mb-4 line-clamp-3 leading-relaxed">
          {autoDescription}
        </p>

        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors group/link">
          바로가기
          <span className="ml-1 group-hover/link:translate-x-1 transition-transform">
            →
          </span>
        </a>

        {/* Admin Actions */}
        {showActions && (
          <div className="mt-6 pt-6 border-t border-slate-700 flex gap-3">
            {!isApproved && onApprove && (
              <button
                onClick={onApprove}
                className="flex-1 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white px-4 py-2.5 rounded-lg font-semibold transition-all hover:scale-105 shadow-lg shadow-green-500/30">
                ✓ 승인
              </button>
            )}
            {onDelete && (
              <button
                onClick={onDelete}
                className={`${!isApproved && onApprove ? 'flex-1' : 'w-full'} bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white px-4 py-2.5 rounded-lg font-semibold transition-all hover:scale-105 shadow-lg shadow-red-500/30`}>
                ✗ 삭제
              </button>
            )}
          </div>
        )}
      </div>
    </div>

    {/* 이미지 상세보기 모달 */}
    {isModalOpen && (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-fade-in"
        onClick={() => setIsModalOpen(false)}>
        <div
          className="relative max-w-6xl max-h-[90vh] w-full"
          onClick={(e) => e.stopPropagation()}>
          {/* 닫기 버튼 */}
          <button
            onClick={() => setIsModalOpen(false)}
            className="absolute -top-12 right-0 text-white hover:text-blue-400 transition-colors flex items-center gap-2 text-sm font-medium">
            <span>닫기</span>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* 이미지 컨테이너 */}
          <div className="bg-slate-900 rounded-2xl overflow-hidden border-2 border-slate-700 shadow-2xl">
            <div className="relative">
              <img
                src={screenshotUrl || thumbnailUrl}
                alt={displayTitle}
                className="w-full h-auto max-h-[80vh] object-contain bg-slate-950"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = thumbnailUrl;
                }}
              />
            </div>
            
            {/* 이미지 정보 */}
            <div className="p-6 bg-gradient-to-br from-slate-800 to-slate-900 border-t border-slate-700">
              <h3 className="text-xl font-bold text-white mb-2">
                {displayTitle}
              </h3>
              <p className="text-slate-400 text-sm mb-4">
                {autoDescription}
              </p>
              <div className="flex gap-3">
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-lg font-semibold transition-all hover:scale-105 shadow-lg shadow-blue-500/30">
                  사이트 방문하기
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
                {screenshotUrl && screenshotUrl !== thumbnailUrl && (
                  <button
                    onClick={() => {
                      const link = document.createElement('a');
                      link.href = screenshotUrl;
                      link.download = `${displayTitle}-screenshot.png`;
                      link.target = '_blank';
                      link.click();
                    }}
                    className="inline-flex items-center bg-slate-700 hover:bg-slate-600 text-white px-6 py-2.5 rounded-lg font-semibold transition-all hover:scale-105">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    이미지 다운로드
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    )}
  </>
  );
}
