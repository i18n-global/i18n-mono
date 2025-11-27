import "./globals.css";

import { I18NexusDevtools } from "i18nexus";
import { getServerLanguage } from "i18nexus/server";
import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Sans_KR } from "next/font/google";
import localFont from "next/font/local";
import { headers } from "next/headers";
import Script from "next/script";

import { translations } from "@/locales";
import { Analytics, FirebaseStatus, GlobalErrorProvider } from "@/shared/ui";
import ClientProvider from "@/shared/ui/ClientProvider";
import { Header } from "@/widgets/navigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const notoSansKR = Noto_Sans_KR({
  variable: "--font-noto-sans-kr",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

const bmHannaPro = localFont({
  src: "../public/font/font.ttf",
  variable: "--font-bmhanna-pro",
  display: "swap",
});

export const metadata: Metadata = {
  title: "i18nexus - Complete React i18n toolkit",
  description:
    "Complete React i18n toolkit with cookie-based language management, Google Sheets integration, and automatic code transformation tools",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Server Component: 쿠키에서 언어 읽기
  const headersList = await headers();
  const language = getServerLanguage(headersList);

  return (
    <html lang={language}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${notoSansKR.variable} ${bmHannaPro.variable} antialiased`}
      >
        {/* Google Analytics: gtag.js (GA4) - uses NEXT_PUBLIC_GA_ID */}
        {process.env.NEXT_PUBLIC_GA_ID ? (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="gtag-init" strategy="afterInteractive">
              {`window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');`}
            </Script>
          </>
        ) : null}

        <ClientProvider translations={translations} initialLanguage={language}>
          <GlobalErrorProvider>
            <Header />
            {children}
            {/* Client-side analytics tracker */}
            <Analytics />
            {/* Firebase connection status indicator - dev only */}
            {process.env.NODE_ENV === "development" && <FirebaseStatus />}
            {process.env.NODE_ENV === "development" && <I18NexusDevtools />}
          </GlobalErrorProvider>
        </ClientProvider>
      </body>
    </html>
  );
}
