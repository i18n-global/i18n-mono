import { Metadata } from "next";
import ServerExamplePage from "@/page/server-example";

export const metadata: Metadata = {
  title: "Server Components - i18nexus",
  description:
    "Learn how to use i18nexus with Next.js Server Components. Better SEO, faster initial load, smaller bundle size.",
  keywords: [
    "server components",
    "next.js",
    "ssr",
    "server-side rendering",
    "i18n server",
  ],
};

export default function Page() {
  return <ServerExamplePage />;
}
