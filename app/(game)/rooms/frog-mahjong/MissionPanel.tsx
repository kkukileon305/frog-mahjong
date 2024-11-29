"use client";
import useFrogMahjongStore from "@/utils/stores/frog-mahjong/useFrogMahjongStore";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { getCookie } from "cookies-next";
import axiosInstance, { MissionResponse } from "@/utils/axios";
import { STARTRequest } from "@/utils/constants/frog-mahjong/socketTypes";
import delay from "@/utils/functions/delay";

const MissionPanel = () => {
  const router = useRouter();
  const userID = getCookie("userID") as string;

  const gameStore = useFrogMahjongStore();

  const m = useTranslations("Game");

  const currentUser = gameStore.gameState?.users?.find(
    (user) => user.id === Number(userID)
  );

  const [isResultLoading, setIsResultLoading] = useState(false);

  const currentMissions = gameStore.allMissions.filter((m) =>
    gameStore.gameState?.gameInfo?.missionIDs?.includes(m.id)
  );

  const [rotateDeg, setRotateDeg] = useState(0);

  useEffect(() => {
    if (!currentUser || gameStore.isGameEnd) return;
    gameStore.setIsRouletteLoading(true);

    const getMissions = async () => {
      try {
        setIsResultLoading(true);

        const { data } = await axiosInstance.get<MissionResponse>(
          "/v2.1/game/missions"
        );

        gameStore.setAllMissions(data.missions);
        setIsResultLoading(false);
      } catch (e) {
        console.log(e);
        router.push("/rooms");
        gameStore.clear();
      }
    };

    getMissions();
  }, []);

  useEffect(() => {
    const spinRoulette = async () => {
      if (gameStore.allMissions.length === 0) return;

      const length = gameStore.allMissions.length;
      const baseDeg = 360 * (5 + (Math.floor(Math.random() * 5) + 1));
      const finalDeg = baseDeg + 4 * (360 / length);

      setRotateDeg(finalDeg);
      await delay(10000);

      if (!currentUser?.isOwner) return;

      const request: STARTRequest = {
        roomID: Number(gameStore.gameState?.gameInfo?.roomID),
        event: "START",
        message: "",
      };

      gameStore.ws?.send(JSON.stringify(request));
    };

    spinRoulette();
  }, [gameStore.allMissions]);

  return (
    <>
      {gameStore.isRouletteLoading && (
        <div className="fixed top-0 z-30 w-full h-full bg-black/50 flex justify-center items-center">
          룰렛이펙트
        </div>
      )}

      <div className="w-full bg-white/50 rounded-xl p-1 border-[#796858] border-8">
        <div className="">
          <p className="p-2 basis-1/6 bg-[#FA4E38] rounded-xl font-bold text-white text-center">
            {m("mission")}
          </p>

          <div className="py-2 px-4">
            {currentMissions &&
              currentMissions.map((m, index) => (
                <p
                  key={m.id}
                  className={`basis-5/6 font-bold text-xs ${
                    gameStore.clearMissionIDs.includes(m.id) && "line-through"
                  }`}
                >
                  {index + 1}. {m.title}
                </p>
              ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default MissionPanel;
