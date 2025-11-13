/**
 * Delete a project from the showcase
 * This function calls the /api/projects/:id DELETE endpoint
 */

interface DeleteResponse {
  id: string;
  message: string;
}

export async function deleteProject(projectId: string): Promise<DeleteResponse> {
  const response = await fetch(`/api/projects/${projectId}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });

  const data = await response.json();

  if (!response.ok) {
    const errorMessage = data.error || "Failed to delete project";
    throw new Error(errorMessage);
  }

  return data;
}
