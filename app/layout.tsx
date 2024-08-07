import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import "./globals.css";
import Header from "@/app/Header";

const font = Noto_Sans_KR({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "개굴작",
  description: "온라인으로 즐길 수 있는 웹 보드게임!",
};

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html lang="kr">
      <body className={font.className}>
        <Header />
        {children}
      </body>
    </html>
  );
};

export default RootLayout;
