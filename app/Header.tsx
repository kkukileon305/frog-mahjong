import React from "react";
import Link from "next/link";
import { hasCookie } from "cookies-next";
import { cookies } from "next/headers";
import MyInfo from "@/app/MyInfo";

const Header = () => {
  const isSignIn = hasCookie("refreshToken", {
    cookies,
  });

  return (
    <header className="h-16 border-b">
      <div className="h-full max-w-[800px] mx-auto flex items-center justify-between">
        <Link href="/" className="font-bold text-2xl">
          메인
        </Link>

        {isSignIn && <MyInfo />}
      </div>
    </header>
  );
};

export default Header;
