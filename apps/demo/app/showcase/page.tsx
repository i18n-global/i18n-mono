import { Metadata } from "next";

import ShowcasePage from "@/page/showcase";

export const metadata: Metadata = {
  title: "Showcase - i18nexus",
  description:
    "Real-world projects using i18nexus and i18nexus-tools. Share your project with the community.",
  keywords: [
    "i18nexus showcase",
    "example projects",
    "i18n examples",
    "community projects",
  ],
};

export default function Page() {
  return <ShowcasePage />;
}
