import { Metadata } from "next";
import DocsDownloadPage from "@/page/docs-i18nexus-tools-download";

export const metadata: Metadata = {
  title: "i18n-download - i18nexus Tools Documentation",
  description:
    "Download translations from Google Sheets with safe incremental updates. Preserves local translations.",
  keywords: ["i18n-download", "google sheets", "translation sync", "incremental update"],
};

export default function Page() {
  return <DocsDownloadPage />;
}
