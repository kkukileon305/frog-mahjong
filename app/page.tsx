import Link from "next/link";
import { getTranslations } from "next-intl/server";
import logo from "@/public/logos/logo.png";
import Image from "next/image";
import React from "react";
import SwitchLocale from "@/utils/components/SwitchLocale";

const Home = async () => {
  const m = await getTranslations("MainPage");

  return (
    <>
      <div className="min-h-[calc(100dvh)] flex flex-col justify-center items-center gap-8">
        <div className="max-w-full px-2">
          <Image src={logo.src} alt="Logo" width={557} height={228} />
        </div>
        <div className="w-full px-2 max-w-xl text-center flex justify-center items-center gap-4 text-white font-bold text-3xl">
          <Link
            href="/signin"
            className="basis-1/2 bg-green-400 px-4 py-2 rounded-xl"
          >
            {m("signIn")}
          </Link>
          <Link
            href="/signup"
            className="basis-1/2 bg-sky-400 px-4 py-2 rounded-xl"
          >
            {m("signUp")}
          </Link>
        </div>

        <SwitchLocale />
      </div>
    </>
  );
};

export default Home;
