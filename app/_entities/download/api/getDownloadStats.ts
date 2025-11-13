import { DownloadStats } from "@/app/_shared/lib";

interface NpmDownloads {
  downloads: number;
  package: string;
  start: string;
  end: string;
}

// 패키지 생성일 (변하지 않는 값)
const PACKAGE_START_DATES: Record<string, string> = {
  i18nexus: "2025-09-28",
  "i18nexus-tools": "2025-09-29",
};

export async function getDownloadStats(
  packageName: string
): Promise<DownloadStats> {
  const startDate = PACKAGE_START_DATES[packageName];

  if (!startDate) {
    throw new Error("Package not found");
  }

  // 패키지 생성일부터 현재까지의 다운로드 수 가져오기
  const endDate = new Date().toISOString().split("T")[0];
  const url = `https://api.npmjs.org/downloads/point/${startDate}:${endDate}/${packageName}`;

  const response = await fetch(url, {
    next: { revalidate: 3600 }, // Cache for 1 hour
  });

  if (!response.ok) {
    throw new Error("Failed to fetch npm data");
  }

  const data: NpmDownloads = await response.json();
  return data;
}
