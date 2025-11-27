/**
 * Sign in with email and password using Firebase
 */

import { signInWithEmailAndPassword } from "firebase/auth";

import { auth } from "@/shared/lib";

export async function signIn(email: string, password: string): Promise<void> {
  if (!auth) {
    throw new Error(
      "Firebase Authentication is not configured. Please set up Firebase environment variables."
    );
  }

  await signInWithEmailAndPassword(auth, email, password);
}
