import SignOutBtn from "@/app/SignOutBtn";
import SwitchLocale from "@/utils/components/SwitchLocale";
import React from "react";
import Link from "next/link";
import { cookies } from "next/headers";
import { getCookie } from "cookies-next";
import { getTranslations } from "next-intl/server";
import logo from "@/public/logos/logo.png";
import Image from "next/image";

const Header = async () => {
  const refreshToken = getCookie("refreshToken", {
    cookies,
  });

  const m = await getTranslations("Metadata");

  return (
    <header className="h-16 border-b px-2">
      <div className="h-full max-w-[800px] mx-auto flex items-center justify-between">
        <Link href="/" className="font-bold text-2xl">
          <Image src={logo.src} alt="Logo" width={92.5} height={38} />
        </Link>

        <div className="flex items-center gap-2">
          {refreshToken && <SignOutBtn />}
          <SwitchLocale />
        </div>
      </div>
    </header>
  );
};

export default Header;
