"use client";
import useWingspanStore from "@/utils/stores/wingspan/useWingspanStore";
import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { getCookie } from "cookies-next";

const MissionPanel = () => {
  const userID = getCookie("userID") as string;

  const gameStore = useWingspanStore();

  const m = useTranslations("Game");

  const currentUser = gameStore.gameState?.users?.find(
    (user) => user.id === Number(userID)
  );

  useEffect(() => {
    if (!currentUser || gameStore.isGameEnd) return;

    const isStarted = localStorage.getItem("isStarted") === "true";

    if (!isStarted) {
      gameStore.setIsRouletteLoading(true);
    }
  }, []);

  return (
    <div className="max-w-[380px] w-full mx-auto bg-white/50 rounded-[3px] p-1 border-[#796858] border-[1.5px]">
      <div className="">
        <p className="basis-1/6 h-[16px] text-[12px] flex items-center justify-center bg-[#FA4E38] rounded-[3px] font-bold text-white text-center tracking-[8px]">
          {m("mission")}
        </p>

        <div className="py-2 px-4">
          {gameStore.currentMissions &&
            gameStore.currentMissions.map((m, index) => (
              <div
                key={m.id}
                className={`flex justify-between basis-5/6 font-bold text-xs text-black ${
                  gameStore.clearMissionIDs.includes(m.id) && "line-through"
                }`}
              >
                <div className="flex items-center gap-2">
                  <p className="text-[12px]">
                    {index + 1}. {m.title}
                  </p>

                  {m.image && (
                    <img src={m.image} alt="" className="w-[14px] h-[14px]" />
                  )}
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default MissionPanel;
