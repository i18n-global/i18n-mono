import { Metadata } from "next";
import DocsWrapperPage from "@/page/docs-i18nexus-tools-wrapper";

export const metadata: Metadata = {
  title: "i18n-wrapper - i18nexus Tools Documentation",
  description:
    "Automatically wrap hardcoded text with t() function. Smart detection and code formatting preservation.",
  keywords: ["i18n-wrapper", "auto wrap", "text wrapping", "translation automation"],
};

export default function Page() {
  return <DocsWrapperPage />;
}
