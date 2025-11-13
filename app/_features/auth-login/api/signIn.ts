/**
 * Sign in with email and password using Firebase
 */

import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/app/_shared/lib";

export async function signIn(email: string, password: string): Promise<void> {
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    // Re-throw the error with the same structure for consistent error handling
    throw error;
  }
}
