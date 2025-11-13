"use client";

import { useTranslation } from "i18nexus";
import { useState } from "react";
import ProjectCard from "@/app/components/ProjectCard";
import { approveProject } from "../api/approveProject";
import { deleteProject } from "../api/deleteProject";

interface ProjectManageCardProps {
  id: string;
  url: string;
  projectName?: string | null;
  autoTitle: string;
  autoDescription: string;
  thumbnailUrl: string;
  screenshotUrl?: string | null;
  isApproved: boolean;
  onApproveSuccess?: () => void;
  onDeleteSuccess?: () => void;
  onError?: (error: string) => void;
}

export default function ProjectManageCard({
  id,
  url,
  projectName,
  autoTitle,
  autoDescription,
  thumbnailUrl,
  screenshotUrl,
  isApproved,
  onApproveSuccess,
  onDeleteSuccess,
  onError,
}: ProjectManageCardProps) {
  const { t } = useTranslation();
  const [approving, setApproving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleApprove = async () => {
    setApproving(true);
    try {
      await approveProject(id);
      onApproveSuccess?.();
    } catch (error) {
      console.error("Approval error:", error);
      const errorMessage =
        error instanceof Error ? error.message : t("승인에 실패했습니다.");
      onError?.(errorMessage);
    } finally {
      setApproving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(t("정말 삭제하시겠습니까?"))) return;

    setDeleting(true);
    try {
      await deleteProject(id);
      onDeleteSuccess?.();
    } catch (error) {
      console.error("Delete error:", error);
      const errorMessage =
        error instanceof Error ? error.message : t("삭제에 실패했습니다.");
      onError?.(errorMessage);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="relative">
      <ProjectCard
        url={url}
        projectName={projectName}
        autoTitle={autoTitle}
        autoDescription={autoDescription}
        thumbnailUrl={thumbnailUrl}
        screenshotUrl={screenshotUrl}
        showActions={true}
        isApproved={isApproved}
        onApprove={handleApprove}
        onDelete={handleDelete}
      />

      {/* Loading overlays */}
      {approving && (
        <div className="absolute inset-0 bg-black/50 rounded-2xl flex items-center justify-center z-40">
          <div className="bg-slate-900 px-4 py-3 rounded-lg">
            <p className="text-white text-sm font-medium">
              {t("승인 중...")}
            </p>
          </div>
        </div>
      )}

      {deleting && (
        <div className="absolute inset-0 bg-black/50 rounded-2xl flex items-center justify-center z-40">
          <div className="bg-slate-900 px-4 py-3 rounded-lg">
            <p className="text-white text-sm font-medium">
              {t("삭제 중...")}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
