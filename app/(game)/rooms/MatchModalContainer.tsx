"use client";

import { useTranslations } from "next-intl";
import CancelMatchBtn from "@/app/(game)/rooms/CancelMatchBtn";
import useGameStore from "@/utils/stores/useGameStore";

const MatchModalContainer = () => {
  const m = useTranslations("CreateRoomForm");
  const password = useGameStore((s) => s.gameState?.gameInfo?.password);

  return (
    <div className="absolute left-0 top-0 w-full h-[calc(100dvh)] bg-black/50 z-30 flex justify-center items-center p-2">
      <div className="relative max-w-3xl w-full max-h-[calc(100dvh-16px)] overflow-y-auto py-8 px-4 shadow bg-green-500 rounded-xl">
        <h3 className="font-bold text-white text-center text-4xl mb-8">
          {m(password ? "create" : "normal")}
        </h3>
        <div className="bg-white flex flex-col items-center gap-8 rounded-xl py-8">
          <p className="text-center text-3xl font-bold">{m("matching")}</p>
          {password && (
            <p>
              <strong className="mr-4">{m("enterCode")}</strong>
              {password}
            </p>
          )}
          <CancelMatchBtn />
        </div>
      </div>
    </div>
  );
};

export default MatchModalContainer;
