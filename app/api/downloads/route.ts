import { NextResponse } from "next/server";

interface NpmDownloads {
  downloads: number;
  package: string;
  start: string;
  end: string;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const packageName = searchParams.get("package");

  if (!packageName) {
    return NextResponse.json(
      { error: "Package name is required" },
      { status: 400 }
    );
  }

  try {
    const url = `https://api.npmjs.org/downloads/point/last-month/${packageName}`;
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
