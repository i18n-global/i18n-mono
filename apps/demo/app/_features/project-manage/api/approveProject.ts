/**
 * Approve a project in the showcase
 * This function calls the /api/projects/:id PATCH endpoint
 */

interface ApproveResponse {
  id: string;
  message: string;
}

export async function approveProject(projectId: string): Promise<ApproveResponse> {
  const response = await fetch(`/api/projects/${projectId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ approved: true }),
  });

  const data = await response.json();

  if (!response.ok) {
    const errorMessage = data.error || "Failed to approve project";
    throw new Error(errorMessage);
  }

  return data;
}
