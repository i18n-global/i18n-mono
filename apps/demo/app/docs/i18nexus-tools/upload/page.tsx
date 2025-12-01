import { Metadata } from "next";
import DocsUploadPage from "@/page/docs-i18nexus-tools-upload";

export const metadata: Metadata = {
  title: "i18n-upload - i18nexus Tools Documentation",
  description:
    "Upload local translations to Google Sheets for team collaboration. Initial setup tool.",
  keywords: ["i18n-upload", "google sheets", "translation upload", "team collaboration"],
};

export default function Page() {
  return <DocsUploadPage />;
}
