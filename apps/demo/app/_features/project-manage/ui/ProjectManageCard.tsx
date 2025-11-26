"use client";

import { useTranslation } from "i18nexus";
import { ProjectCard } from "@/app/_entities/project";

interface ProjectManageCardProps {
  url: string;
  projectName?: string | null;
  autoTitle: string;
  autoDescription: string;
  thumbnailUrl: string;
  screenshotUrl?: string | null;
  isApproved: boolean;
  onApprove?: () => void;
  onDelete?: () => void;
}

/**
 * ProjectManageCard - Adds management actions (approve/delete) to ProjectCard
 * Wraps the read-only ProjectCard from entities layer with interactive features
 */
export default function ProjectManageCard({
  url,
  projectName,
  autoTitle,
  autoDescription,
  thumbnailUrl,
  screenshotUrl,
  isApproved,
  onApprove,
  onDelete,
}: ProjectManageCardProps) {
  const { t } = useTranslation();

  return (
    <div className="relative">
      {/* Base ProjectCard (read-only) */}
      <ProjectCard
        url={url}
        projectName={projectName}
        autoTitle={autoTitle}
        autoDescription={autoDescription}
        thumbnailUrl={thumbnailUrl}
        screenshotUrl={screenshotUrl}
      />

      {/* Admin Actions Overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 lg:p-6 bg-gradient-to-t from-slate-900/95 to-transparent rounded-b-2xl">
        <div className="flex gap-2 sm:gap-3">
          {!isApproved && onApprove && (
            <button
              onClick={onApprove}
              className="flex-1 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg text-sm sm:text-base font-semibold transition-all hover:scale-105 shadow-lg shadow-green-500/30">
              {t("✓ 승인")}
            </button>
          )}
          {onDelete && (
            <button
              onClick={onDelete}
              className={`${!isApproved && onApprove ? "flex-1" : "w-full"} bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg text-sm sm:text-base font-semibold transition-all hover:scale-105 shadow-lg shadow-red-500/30`}>
              {t("✗ 삭제")}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
