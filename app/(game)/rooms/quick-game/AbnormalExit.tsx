"use client";

import Link from "next/link";
import React, { useEffect } from "react";
import { useTranslations } from "next-intl";
import useOldFrogMahjongStore from "@/utils/stores/old-frog-mahjong/useOldFrogMahjongStore";
import { useRouter } from "next/navigation";
import useFrogMahjongStore from "@/utils/stores/frog-mahjong/useFrogMahjongStore";

const AbnormalExit = () => {
  const m = useTranslations("AbnormalExit");
  const oldClear = useOldFrogMahjongStore((s) => s.clear);
  const clear = useFrogMahjongStore((s) => s.clear);

  const router = useRouter();

  useEffect(() => {
    const timeout = setTimeout(() => {
      router.push("/rooms");

      localStorage.removeItem("sessionID");

      oldClear();
      clear();
    }, 3000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="relative flex h-[calc(100dvh)] justify-center items-center">
      <div className="p-4 w-full max-w-3xl rounded-xl flex justify-center items-center flex-col">
        <p className="font-bold text-3xl">{m("title")}</p>
        <Link
          onClick={() => {
            localStorage.removeItem("sessionID");
            localStorage.removeItem("matchMode");

            oldClear();
            clear();
          }}
          className="bg-white py-2 px-4 mt-4 border border-blue-400 rounded-xl text-blue-400 font-bold"
          href={"/rooms"}
        >
          {m("back")}
        </Link>
      </div>
    </div>
  );
};

export default AbnormalExit;
