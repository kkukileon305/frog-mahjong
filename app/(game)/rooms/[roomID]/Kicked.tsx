import Link from "next/link";
import React from "react";
import { useTranslations } from "next-intl";

const KickedGame = () => {
  const m = useTranslations("KickedGame");

  return (
    <div className="flex h-[calc(100dvh)] bg-gray-200 justify-center items-center">
      <div className="p-4 w-full max-w-3xl bg-white rounded-xl flex justify-center items-center flex-col">
        <p className="font-bold text-3xl">{m("title")}</p>
        <Link
          className="py-2 px-4 mt-4 border border-blue-400 rounded-xl text-blue-400 font-bold"
          href={"/rooms"}
        >
          {m("back")}
        </Link>
      </div>
    </div>
  );
};

export default KickedGame;
