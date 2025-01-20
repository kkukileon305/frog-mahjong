import Link from "next/link";
import { getTranslations } from "next-intl/server";
import logo from "@/public/logos/logo.png";
import Image from "next/image";
import React from "react";
import SwitchLocale from "@/utils/components/SwitchLocale";
import GameTypeSwiper from "@/app/(game)/rooms/GameTypeSwiper";

const Home = async () => {
  const m = await getTranslations("MainPage");

  return (
    <div className="min-h-[calc(100dvh)] flex flex-col justify-center items-center gap-8 px-2">
      <div className="max-w-2xl w-full">
        <GameTypeSwiper />
      </div>
      <div className="w-full px-2 max-w-xl text-center flex justify-center items-center gap-4 text-white font-bold">
        <Link
          href="/signin"
          className="basis-1/2 bg-[#4ADE80] px-4 py-2 rounded-[3px]"
        >
          {m("signIn")}
        </Link>
        <Link
          href="/signup"
          className="basis-1/2 bg-[#38BDF8] px-4 py-2 rounded-[3px]"
        >
          {m("signUp")}
        </Link>
      </div>

      <SwitchLocale />
    </div>
  );
};

export default Home;
