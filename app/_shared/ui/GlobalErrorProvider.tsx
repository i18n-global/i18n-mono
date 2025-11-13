"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface ErrorContextType {
  error: string | null;
  setError: (error: string | null) => void;
  clearError: () => void;
}

const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

export function GlobalErrorProvider({ children }: { children: ReactNode }) {
  const [error, setError] = useState<string | null>(null);

  const clearError = () => setError(null);

  return (
    <ErrorContext.Provider value={{ error, setError, clearError }}>
      {children}
      {error && (
        <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-red-900/95 border border-red-700 text-white px-6 py-4 rounded-lg shadow-2xl z-50 animate-slide-up">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3">
              <span className="text-2xl">⚠️</span>
              <div>
                <h3 className="font-semibold mb-1">Error</h3>
                <p className="text-sm text-red-100">{error}</p>
              </div>
            </div>
            <button
              onClick={clearError}
              className="text-red-200 hover:text-white transition-colors ml-4">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
    </ErrorContext.Provider>
  );
}

export function useError() {
  const context = useContext(ErrorContext);
  if (context === undefined) {
    throw new Error("useError must be used within a GlobalErrorProvider");
  }
  return context;
}
