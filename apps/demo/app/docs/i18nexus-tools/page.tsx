import { Metadata } from "next";
import DocsToolsPage from "@/page/docs-i18nexus-tools";

export const metadata: Metadata = {
  title: "CLI Tools - i18nexus Documentation",
  description:
    "Automate your i18n workflow with powerful CLI tools. Auto-wrap, extract, and sync translations.",
  keywords: [
    "i18n cli",
    "translation tools",
    "automation",
    "i18nexus-tools",
  ],
};

export default function Page() {
  return <DocsToolsPage />;
}
