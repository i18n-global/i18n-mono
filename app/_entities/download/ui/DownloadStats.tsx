"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "i18nexus";
import type { DownloadStats as DownloadStatsType } from "@/app/_shared/lib";

interface DownloadStatsProps {
  packageName: string;
  displayName: string;
  color: "blue" | "indigo" | "purple";
}

const colorClasses = {
  blue: {
    bg: "from-blue-500 to-blue-600",
    border: "border-blue-500/30",
    text: "text-blue-400",
    shadow: "shadow-blue-500/20",
  },
  indigo: {
    bg: "from-indigo-500 to-indigo-600",
    border: "border-indigo-500/30",
    text: "text-indigo-400",
    shadow: "shadow-indigo-500/20",
  },
  purple: {
    bg: "from-purple-500 to-purple-600",
    border: "border-purple-500/30",
    text: "text-purple-400",
    shadow: "shadow-purple-500/20",
  },
};

export default function DownloadStats({
  packageName,
  displayName,
  color,
}: DownloadStatsProps) {
  const { t } = useTranslation("common");
  const [stats, setStats] = useState<DownloadStatsType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch(`/api/downloads?package=${packageName}`);
        if (!response.ok) throw new Error("Failed to fetch");
        const data = await response.json();
        setStats(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, [packageName]);

  const colors = colorClasses[color];

  if (loading) {
    return (
      <div className={`bg-slate-900 rounded-xl border ${colors.border} p-6`}>
        <div className="flex items-center justify-between">
          <div>
            <p className={`text-sm font-medium ${colors.text}`}>
              {displayName}
            </p>
            <div className="h-8 w-24 bg-slate-800 rounded animate-pulse mt-2"></div>
          </div>
          <div
            className={`w-12 h-12 bg-gradient-to-br ${colors.bg} rounded-lg flex items-center justify-center opacity-50`}>
            <span className="text-white font-bold text-xl">📦</span>
          </div>
        </div>
        <p className="text-xs text-slate-500 mt-3">{t("Loading...")}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-slate-900 rounded-xl border border-red-500/30 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-red-400">{displayName}</p>
            <p className="text-2xl font-bold text-slate-500 mt-2">--</p>
          </div>
          <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center">
            <span className="text-white text-xl">⚠️</span>
          </div>
        </div>
        <p className="text-xs text-red-400 mt-3">{t("Failed to load")}</p>
      </div>
    );
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("en-US").format(num);
  };

  return (
    <div
      className={`bg-slate-900 rounded-xl border ${colors.border} p-6 hover:border-${color}-500/50 transition-colors ${colors.shadow} hover:shadow-lg`}>
      <div className="flex items-center justify-between">
        <div>
          <p className={`text-sm font-medium ${colors.text}`}>{displayName}</p>
          <p className="text-3xl font-bold text-white mt-2">
            {stats ? formatNumber(stats.downloads) : "0"}
          </p>
        </div>
        <div
          className={`w-12 h-12 bg-gradient-to-br ${colors.bg} rounded-lg flex items-center justify-center shadow-lg`}>
          <span className="text-white font-bold text-xl">📦</span>
        </div>
      </div>
      <p className="text-xs text-slate-500 mt-3">{t("Total downloads")}</p>
    </div>
  );
}
