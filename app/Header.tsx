import React from "react";
import Link from "next/link";
import { getCookie } from "cookies-next";
import { cookies } from "next/headers";
import SignOutBtn from "@/app/SignOutBtn";
import { getTranslations } from "next-intl/server";

const Header = async () => {
  const refreshToken = getCookie("refreshToken", {
    cookies,
  });

  const m = await getTranslations("Metadata");

  return (
    <header className="h-16 border-b px-2">
      <div className="h-full max-w-[800px] mx-auto flex items-center justify-between">
        <Link href="/" className="font-bold text-2xl">
          {m("title")}
        </Link>

        {refreshToken && <SignOutBtn />}
      </div>
    </header>
  );
};

export default Header;
