import { Metadata } from "next";
import DocsI18nexusProviderPage from "@/page/docs-i18nexus-provider";

export const metadata: Metadata = {
  title: "I18nProvider - i18nexus Documentation",
  description:
    "React Context Provider for i18n with cookie-based persistence and SSR support. Zero hydration mismatches.",
  keywords: ["I18nProvider", "react context", "i18n provider", "ssr"],
};

export default function Page() {
  return <DocsI18nexusProviderPage />;
}
