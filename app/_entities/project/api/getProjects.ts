import { db } from "@/app/_shared/lib";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import type { ProjectSubmission } from "@/app/_shared/lib";

/**
 * Get projects from Firestore
 * @param approvedOnly - Filter by approved status (true/false/undefined for all)
 */
export async function getProjects(
  approvedOnly?: boolean
): Promise<ProjectSubmission[]> {
  // Return empty array if Firebase is not configured
  if (!db) {
    console.warn("Firebase is not configured. Returning empty projects list.");
    return [];
  }

  try {
    let q = query(
      collection(db, "submissions"),
      orderBy("submittedAt", "desc")
    );

    if (approvedOnly !== undefined) {
      q = query(
        collection(db, "submissions"),
        where("approved", "==", approvedOnly),
        orderBy("submittedAt", "desc")
      );
    }

    const querySnapshot = await getDocs(q);
    const projects = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as ProjectSubmission[];

    return projects;
  } catch (error: unknown) {
    const errorObj = error as { code?: string; message?: string };

    // Firestore 인덱스 에러 감지
    if (
      errorObj.message?.includes("index") ||
      errorObj.message?.includes("Index")
    ) {
      throw new Error("FIRESTORE_INDEX_REQUIRED: " + errorObj.message);
    }

    // Firestore 관련 에러 감지
    if (
      errorObj.code?.includes("firestore") ||
      errorObj.message?.includes("Firestore")
    ) {
      throw new Error(
        "FIRESTORE_NOT_CONFIGURED: Firestore Database is not configured"
      );
    }

    throw new Error("Failed to fetch projects: " + errorObj.message);
  }
}
