/**
 * Sign out the current Firebase user
 */

import { signOut as firebaseSignOut } from "firebase/auth";
import { auth } from "@/app/_shared/lib";

export async function signOut(): Promise<void> {
  if (!auth) {
    throw new Error("Firebase Authentication is not configured. Please set up Firebase environment variables.");
  }

  try {
    await firebaseSignOut(auth);
  } catch (error) {
    console.error("Sign out error:", error);
    throw error;
  }
}
