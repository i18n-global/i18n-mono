"use client";

import { I18nProvider } from "i18nexus";
import { ReactNode } from "react";

interface ClientProviderProps {
  children: ReactNode;
  translations: Record<string, Record<string, string>>;
  initialLanguage: string;
}

export default function ClientProvider({
  children,
  translations,
  initialLanguage,
}: ClientProviderProps) {
  return (
    <I18nProvider translations={translations} initialLanguage={initialLanguage}>
      {children}
    </I18nProvider>
  );
}
