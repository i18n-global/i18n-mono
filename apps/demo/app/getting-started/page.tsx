import { Metadata } from "next";

import GettingStartedPage from "@/page/getting-started";

export const metadata: Metadata = {
  title: "Getting Started - i18nexus",
  description:
    "Complete step-by-step guide to set up i18nexus in your project. Get multilingual support running in 1 minute.",
  keywords: [
    "i18n setup",
    "react i18n tutorial",
    "internationalization guide",
    "i18nexus tutorial",
  ],
};

export default function Page() {
  return <GettingStartedPage />;
}
