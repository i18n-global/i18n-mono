import { Metadata } from "next";
import DocsI18nexusProviderPage from "@/page/docs-i18nexus-provider";

export const metadata: Metadata = {
  title: "Lazy Loading - i18nexus Documentation",
  description:
    "Load translation namespaces on-demand for better performance. Reduce initial bundle size.",
  keywords: ["lazy loading", "code splitting", "performance", "i18n optimization"],
};

// TODO: Create dedicated lazy-loading documentation page
export default function Page() {
  return <DocsI18nexusProviderPage />;
}
