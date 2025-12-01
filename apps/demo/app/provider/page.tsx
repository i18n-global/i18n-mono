import { Metadata } from "next";
import ProviderPage from "@/page/provider";

export const metadata: Metadata = {
  title: "I18nProvider - i18nexus",
  description:
    "React Context Provider with cookie-based language persistence and SSR support. Zero hydration mismatches.",
  keywords: [
    "react context",
    "i18n provider",
    "ssr",
    "cookie persistence",
    "hydration",
  ],
};

export default function Page() {
  return <ProviderPage />;
}
