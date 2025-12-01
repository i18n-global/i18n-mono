import { Metadata } from "next";

import HomePage from "@/page/home";

export const metadata: Metadata = {
  title: "i18nexus - Complete React i18n Toolkit",
  description:
    "Type-safe React i18n toolkit with intelligent automation, SSR support, and Google Sheets integration. Simplify multilingual app development.",
  keywords: [
    "i18n",
    "react",
    "internationalization",
    "translation",
    "typescript",
    "ssr",
    "next.js",
  ],
  openGraph: {
    title: "i18nexus - Complete React i18n Toolkit",
    description:
      "Type-safe React i18n toolkit with intelligent automation and SSR support",
    type: "website",
  },
};

export default function Page() {
  return <HomePage />;
}
