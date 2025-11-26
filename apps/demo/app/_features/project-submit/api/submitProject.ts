/**
 * Submit a project to the showcase
 * This function calls the /api/submissions endpoint
 */

interface SubmitProjectPayload {
  url: string;
  projectName: string | null;
  autoTitle: string;
  autoDescription: string;
  thumbnailUrl: string;
  screenshotUrl?: string | null;
  contactEmail: string | null;
}

interface SubmitResponse {
  id: string;
  message: string;
}

export async function submitProject(
  payload: SubmitProjectPayload
): Promise<SubmitResponse> {
  const response = await fetch("/api/submissions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    const errorMessage = data.error || "Failed to submit";
    throw new Error(errorMessage);
  }

  return data;
}
