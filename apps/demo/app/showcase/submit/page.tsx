import { Metadata } from "next";
import ShowcaseSubmitPage from "@/page/showcase-submit";

export const metadata: Metadata = {
  title: "Submit Project - Showcase - i18nexus",
  description:
    "Share your project using i18nexus with the community. Submit to the showcase gallery.",
  keywords: ["submit project", "showcase submission", "community", "i18nexus showcase"],
};

export default function Page() {
  return <ShowcaseSubmitPage />;
}
