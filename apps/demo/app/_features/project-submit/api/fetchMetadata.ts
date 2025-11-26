/**
 * Fetch metadata (title, description, thumbnails) for a given URL
 * This function calls the /api/metadata endpoint
 */

interface MetadataResponse {
  autoTitle: string;
  autoDescription: string;
  thumbnailUrl: string;
  screenshotUrl?: string | null;
  url: string;
}

export async function fetchMetadata(url: string): Promise<MetadataResponse> {
  const response = await fetch("/api/metadata", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }),
  });

  let data;
  try {
    data = await response.json();
  } catch (jsonError) {
    console.error("JSON parsing error:", jsonError);
    throw new Error("서버 응답을 처리할 수 없습니다. 잠시 후 다시 시도해주세요.");
  }

  if (!response.ok) {
    // API에서 반환한 에러 메시지 사용
    const errorMessage = data.error || "Failed to fetch metadata";
    const errorDetails = data.details ? ` (${data.details})` : "";
    throw new Error(errorMessage + errorDetails);
  }

  return data;
}
