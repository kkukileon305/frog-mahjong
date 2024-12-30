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
  const { clear, ws, timerId } = useFrogMahjongStore((s) => ({
    clear: s.clear,
    ws: s.ws,
    timerId: s.timerId,
  }));

  const router = useRouter();

  useEffect(() => {
    const timeout = setTimeout(() => {
      router.push("/rooms");

      if (process.env.NODE_ENV === "development") {
        console.log("abnormal redirect");
      }
    }, 3000);

    localStorage.removeItem("matchMode");
    localStorage.removeItem("sessionID");
    localStorage.removeItem("pick");
    localStorage.removeItem("clearMissions");
    localStorage.removeItem("victoryFailed");
    localStorage.removeItem("isStarted");

    return () => {
      clearTimeout(timeout);

      oldClear();
      clear();
      ws?.close();
      timerId && clearTimeout(timerId);
    };
  }, []);

  return (
    <div className="relative flex h-[calc(100dvh)] justify-center items-center">
      <div className="p-4 w-full max-w-3xl rounded-xl flex justify-center items-center flex-col">
        <p className="font-bold text-3xl">{m("title")}</p>
        <Link
          className="flex bg-white py-2 text-center px-4 mt-4 border border-blue-400 rounded-xl text-blue-400 font-bold"
          href={"/rooms"}
        >
          {m("back")}
        </Link>
      </div>
    </div>
  );
};

export default AbnormalExit;
