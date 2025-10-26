import { NextResponse } from "next/server";

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

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const packageName = searchParams.get("package");

  if (!packageName) {
    return NextResponse.json(
      { error: "Package name is required" },
      { status: 400 }
    );
  }

  const startDate = PACKAGE_START_DATES[packageName];

  if (!startDate) {
    return NextResponse.json({ error: "Package not found" }, { status: 404 });
  }

  try {
    // 패키지 생성일부터 현재까지의 다운로드 수 가져오기
    const endDate = new Date().toISOString().split("T")[0];
    const url = `https://api.npmjs.org/downloads/point/${startDate}:${endDate}/${packageName}`;

    const response = await fetch(url, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch npm data" },
        { status: 500 }
      );
    }

    const data: NpmDownloads = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching npm downloads:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
