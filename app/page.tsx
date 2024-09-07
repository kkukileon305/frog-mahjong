import { getCookie } from "cookies-next";
import { cookies } from "next/headers";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import logo from "@/public/logos/logo.png";
import Image from "next/image";
import React from "react";
import { redirect } from "next/navigation";

const Home = async () => {
  const refreshToken = getCookie("refreshToken", {
    cookies,
  });

  if (refreshToken) {
    redirect("/rooms");
  }

  const m = await getTranslations("MainPage");

  return (
    <>
      <div className="min-h-[calc(100dvh)] flex flex-col justify-center items-center gap-8">
        <div className="max-w-full px-2">
          <Image src={logo.src} alt="Logo" width={557} height={228} />
        </div>

        <div className="flex justify-center items-center gap-4 font-bold text-3xl">
          <Link href="/signin">{m("signIn")}</Link>
          <Link href="/signup">{m("signUp")}</Link>
        </div>
      </div>
    </>
  );
};

export default Home;
