import { Metadata } from "next";
import DocsI18nexusPage from "@/page/docs-i18nexus";

export const metadata: Metadata = {
  title: "i18nexus Library Documentation",
  description:
    "Complete React i18n toolkit with cookie-based language management and SSR support. API reference and guides.",
  keywords: ["i18nexus docs", "i18n documentation", "react i18n api"],
};

export default function Page() {
  return <DocsI18nexusPage />;
}
