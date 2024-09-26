import { Noto_Sans_KR } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { getLocale, getMessages, getTranslations } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import "./globals.css";
import { Metadata } from "next";
import LoadAudio from "@/utils/components/LoadAudio";
import React from "react";

const font = Noto_Sans_KR({ subsets: ["latin"] });

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
      <body className={font.className}>
        <NextIntlClientProvider messages={messages}>
          <div className="min-h-[calc(100dvh)] bg-main bg-center bg-cover">
            {children}
          </div>
        </NextIntlClientProvider>

        <SpeedInsights />

        <LoadAudio />
      </body>
    </html>
  );
};

export default RootLayout;
