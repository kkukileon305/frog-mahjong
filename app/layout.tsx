import { Noto_Sans_KR, Noto_Sans_JP } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { getLocale, getMessages, getTranslations } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import "./globals.css";
import { Metadata } from "next";
import React from "react";
import Script from "next/script";

const fontKR = Noto_Sans_KR({ subsets: ["latin"] });
const fontJP = Noto_Sans_JP({ subsets: ["latin"] });

export const generateMetadata = async (): Promise<Metadata> => {
  const m = await getTranslations("Metadata");

  return {
    title: {
      template: `%s - ${m("title")}`,
      default: m("title"),
    },
    description: m("description"),
    metadataBase: new URL(process.env.NEXT_PUBLIC_PRODUCTION_URL as string),
    alternates: {
      canonical: process.env.NEXT_PUBLIC_PRODUCTION_URL as string,
    },
  };
};

const RootLayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <head>
        <meta name="google-adsense-account" content="ca-pub-8565533394290929" />
      </head>
      <body className={locale === "kr" ? fontKR.className : fontJP.className}>
        <NextIntlClientProvider messages={messages}>
          <div className="min-h-[calc(100dvh)] bg-main bg-top">{children}</div>
        </NextIntlClientProvider>

        {process.env.NODE_ENV !== "development" && (
          <Script
            async
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8565533394290929"
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        )}
      </body>
    </html>
  );
};

export default RootLayout;
