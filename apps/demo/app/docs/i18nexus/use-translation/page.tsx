import { Metadata } from "next";
import DocsUseTranslationPage from "@/page/docs-i18nexus-use-translation";

export const metadata: Metadata = {
  title: "useTranslation Hook - i18nexus Documentation",
  description:
    "React hook for accessing translations in Client Components. Type-safe with TypeScript.",
  keywords: ["useTranslation", "react hook", "i18n hook", "translation hook"],
};

export default function Page() {
  return <DocsUseTranslationPage />;
}
