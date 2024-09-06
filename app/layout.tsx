import { Noto_Sans_KR } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { getLocale, getMessages, getTranslations } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import "./globals.css";

const font = Noto_Sans_KR({ subsets: ["latin"] });

export const generateMetadata = async () => {
  const m = await getTranslations("Metadata");

  return {
    title: m("title"),
    description: m("description"),
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
          {children}
        </NextIntlClientProvider>

        <SpeedInsights />
      </body>
    </html>
  );
};

export default RootLayout;
