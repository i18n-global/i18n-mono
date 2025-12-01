import { Metadata } from "next";
import DocsExtractorPage from "@/page/docs-i18nexus-tools-extractor";

export const metadata: Metadata = {
  title: "i18n-extractor - i18nexus Tools Documentation",
  description:
    "Extract translation keys from your codebase and intelligently merge with existing translations.",
  keywords: ["i18n-extractor", "key extraction", "translation extraction", "smart merge"],
};

export default function Page() {
  return <DocsExtractorPage />;
}
