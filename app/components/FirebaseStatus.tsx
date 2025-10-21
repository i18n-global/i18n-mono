"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs, limit, query } from "firebase/firestore";

export default function FirebaseStatus() {
  const [status, setStatus] = useState<{
    auth: boolean;
    firestore: boolean;
    user: string | null;
  }>({
    auth: false,
    firestore: false,
    user: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkFirebase = async () => {
      try {
        // Check Auth
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          setStatus((prev) => ({
            ...prev,
            auth: true,
            user: user?.email || null,
          }));
        });

        // Check Firestore
        try {
          const q = query(collection(db, "submissions"), limit(1));
          await getDocs(q);
          setStatus((prev) => ({ ...prev, firestore: true }));
        } catch (error) {
          console.log("Firestore not accessible yet:", error);
          setStatus((prev) => ({ ...prev, firestore: false }));
        }

        setLoading(false);
        return () => unsubscribe();
      } catch (error) {
        console.error("Firebase check error:", error);
        setLoading(false);
      }
    };

    checkFirebase();
  }, []);

  if (loading) {
    return (
      <div className="fixed bottom-4 right-4 bg-slate-800 text-white px-4 py-2 rounded-lg shadow-lg">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          <span className="text-sm">Firebase 연결 확인 중...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 bg-slate-800 text-white px-4 py-3 rounded-lg shadow-lg border border-slate-700">
      <div className="text-xs font-semibold mb-2">🔥 Firebase Status</div>
      <div className="space-y-1 text-xs">
        <div className="flex items-center justify-between space-x-4">
          <span>Authentication:</span>
          <span className={status.auth ? "text-green-400" : "text-red-400"}>
            {status.auth ? "✓ Connected" : "✗ Failed"}
          </span>
        </div>
        <div className="flex items-center justify-between space-x-4">
          <span>Firestore:</span>
          <span
            className={status.firestore ? "text-green-400" : "text-yellow-400"}>
            {status.firestore ? "✓ Connected" : "⚠ Setup Needed"}
          </span>
        </div>
        {status.user && (
          <div className="pt-2 mt-2 border-t border-slate-700">
            <span className="text-slate-400">Logged in: </span>
            <span className="text-blue-400">{status.user}</span>
          </div>
        )}
      </div>
    </div>
  );
}
