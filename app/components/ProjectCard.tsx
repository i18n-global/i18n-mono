interface ProjectCardProps {
  url: string;
  projectName?: string | null;
  autoTitle: string;
  autoDescription: string;
  thumbnailUrl: string;
  showActions?: boolean;
  onApprove?: () => void;
  onDelete?: () => void;
}

export default function ProjectCard({
  url,
  projectName,
  autoTitle,
  autoDescription,
  thumbnailUrl,
  showActions = false,
  onApprove,
  onDelete,
}: ProjectCardProps) {
  const displayTitle = projectName || autoTitle;

  return (
    <div className="group bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl border border-slate-700 hover:border-blue-500 overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 hover:-translate-y-1">
      {/* Thumbnail */}
      <div className="relative w-full h-48 bg-slate-950 overflow-hidden">
        <img
          src={thumbnailUrl}
          alt={displayTitle}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/default-thumbnail.svg";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
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
            <button
              onClick={onApprove}
              className="flex-1 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white px-4 py-2.5 rounded-lg font-semibold transition-all hover:scale-105 shadow-lg shadow-green-500/30">
              ✓ 승인
            </button>
            <button
              onClick={onDelete}
              className="flex-1 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white px-4 py-2.5 rounded-lg font-semibold transition-all hover:scale-105 shadow-lg shadow-red-500/30">
              ✗ 삭제
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
