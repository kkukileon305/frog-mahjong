import React from "react";
import Link from "next/link";
import { getCookie, hasCookie } from "cookies-next";
import { cookies } from "next/headers";
import SignOutBtn from "@/app/SignOutBtn";

const Header = async () => {
  const refreshToken = getCookie("refreshToken", {
    cookies,
  });

  return (
    <header className="h-16 border-b px-2">
      <div className="h-full max-w-[800px] mx-auto flex items-center justify-between">
        <Link href="/" className="font-bold text-2xl">
          메인
        </Link>

        {refreshToken && <SignOutBtn />}
      </div>
    </header>
  );
};

export default Header;
