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

    // Firestore permission error - return empty array instead of throwing
    if (
      errorObj.code?.includes("permission-denied") ||
      errorObj.message?.includes("PERMISSION_DENIED") ||
      errorObj.message?.includes("Missing or insufficient permissions")
    ) {
      console.warn(
        "Firestore permission denied. Please configure Firestore Security Rules to allow read access. Returning empty projects list."
      );
      return [];
    }

    // Firestore 인덱스 에러 감지
    if (
      errorObj.message?.includes("index") ||
      errorObj.message?.includes("Index")
    ) {
      console.warn("Firestore index required:", errorObj.message);
      return [];
    }

    // Firestore 관련 에러 감지
    if (
      errorObj.code?.includes("firestore") ||
      errorObj.message?.includes("Firestore")
    ) {
      console.warn("Firestore not configured:", errorObj.message);
      return [];
    }

    console.error("Failed to fetch projects:", errorObj.message);
    return [];
  }
}
