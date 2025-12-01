"use client";
interface ProjectCardProps {
  url: string;
  projectName?: string;
  autoTitle: string;
  autoDescription: string;
  thumbnailUrl: string;
  screenshotUrl?: string | undefined;
}

export function ProjectCard({
  url,
  projectName,
  autoTitle,
  autoDescription,
  thumbnailUrl,
  screenshotUrl,
}: ProjectCardProps) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="block bg-slate-900 rounded-xl border border-slate-700 overflow-hidden hover:border-blue-500 transition-colors"
    >
      <div className="aspect-video bg-slate-800 relative">
        <img
          src={screenshotUrl || thumbnailUrl}
          alt={autoTitle}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-bold text-white mb-2">{autoTitle}</h3>
        <p className="text-sm text-slate-400 line-clamp-2">{autoDescription}</p>
        <p className="text-xs text-blue-400 mt-2">{projectName || "Unknown"}</p>
      </div>
    </a>
  );
}
