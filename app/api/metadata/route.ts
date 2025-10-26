import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    // Validate URL format
    try {
      new URL(url);
    } catch {
      return NextResponse.json(
        { error: "Invalid URL format" },
        { status: 400 }
      );
    }

    // Use microlink.io to fetch metadata and generate thumbnail
    // screenshot=true로 스크린샷 생성, embed 없이 JSON 응답 받기
    const microlinkUrl = `https://api.microlink.io/?url=${encodeURIComponent(url)}&screenshot=true&meta=false`;

    console.log("🔍 Fetching metadata from:", microlinkUrl);

    const response = await fetch(microlinkUrl, {
      headers: {
        "User-Agent": "i18nexus-showcase/1.0",
        Accept: "application/json",
      },
      // 15초 타임아웃 (스크린샷 생성 시간 고려)
      signal: AbortSignal.timeout(15000),
    });

    if (!response.ok) {
      console.error(
        "❌ Microlink API error:",
        response.status,
        response.statusText
      );

      // Rate limit 에러인 경우
      if (response.status === 429) {
        return NextResponse.json(
          {
            error: "메타데이터 서비스의 요청 한도를 초과했습니다",
            details: "잠시 후 다시 시도해주세요",
          },
          { status: 429 }
        );
      }

      return NextResponse.json(
        {
          error: "메타데이터 서비스에서 오류가 발생했습니다",
          details: `HTTP ${response.status}: ${response.statusText}`,
        },
        { status: 500 }
      );
    }

    // Content-Type 확인
    const contentType = response.headers.get("content-type");
    console.log("📋 Response content-type:", contentType);

    if (!contentType?.includes("application/json")) {
      console.error("❌ Unexpected content type:", contentType);
      return NextResponse.json(
        {
          error: "메타데이터 서비스가 예상치 못한 응답을 반환했습니다",
          details: `Expected JSON but got ${contentType}`,
        },
        { status: 500 }
      );
    }

    const data = await response.json();
    console.log("📦 Microlink response status:", data.status);

    if (data.status !== "success") {
      console.error("❌ Microlink returned error:", data);

      // Microlink가 URL에 접근할 수 없는 경우
      if (data.status === "fail" && data.message?.includes("ENOTFOUND")) {
        return NextResponse.json(
          {
            error: "URL에 접근할 수 없습니다",
            details: "도메인이 존재하지 않거나 접근할 수 없습니다",
          },
          { status: 400 }
        );
      }

      return NextResponse.json(
        {
          error: "메타데이터 추출에 실패했습니다",
          details: data.message || "Unknown error from metadata service",
        },
        { status: 500 }
      );
    }

    // Extract metadata from microlink response
    // og:image를 우선 사용하고, 없으면 스크린샷 사용
    const ogImage = data.data?.image?.url;
    const screenshotImage = data.data?.screenshot?.url;
    
    const metadata = {
      autoTitle: data.data?.title || data.data?.url || "Untitled Project",
      autoDescription: data.data?.description || "No description available",
      thumbnailUrl: ogImage || screenshotImage || "/default-thumbnail.svg",
      screenshotUrl: screenshotImage || null, // 상세보기용 스크린샷
      ogImageUrl: ogImage || null, // 원본 메타 이미지
      url,
    };

    console.log("✅ Metadata extracted successfully:", {
      hasOgImage: !!ogImage,
      hasScreenshot: !!screenshotImage,
    });
    return NextResponse.json(metadata);
  } catch (error: unknown) {
    console.error("❌ Metadata fetch error:", error);

    const errorObj = error as { message?: string };

    return NextResponse.json(
      {
        error: "Failed to fetch metadata",
        details: errorObj.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}
