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

  const {
    allMissions,
    missionID,
    setIsPickCardsModal,
    ws,
    users,
    gameInfo,
    isGameEnd,
    setMissions,
    clear,
  } = useFrogMahjongStore((s) => ({
    allMissions: s.missions,
    missionID: s.gameState?.gameInfo?.missionID as number,
    setIsPickCardsModal: s.setIsPickCardsModal,
    ws: s.ws,
    users: s.gameState?.users,
    gameInfo: s.gameState?.gameInfo,
    isGameEnd: s.isGameEnd,
    setMissions: s.setMissions,
    clear: s.clear,
  }));

  const m = useTranslations("Game");

  const currentUser = users?.find((user) => user.id === Number(userID));

  const [isRouletteLoading, setIsRouletteLoading] = useState(true);
  const [isResultLoading, setIsResultLoading] = useState(false);

  const currentMission = allMissions.find((m) => m.id === missionID);

  const [rotateDeg, setRotateDeg] = useState(0);

  useEffect(() => {
    if (!currentUser || isGameEnd) return;

    const getMissions = async () => {
      try {
        setIsResultLoading(true);

        const { data } = await axiosInstance.get<MissionResponse>(
          "/v2.1/game/missions"
        );

        setMissions(data.missions);
        setIsResultLoading(false);
      } catch (e) {
        console.log(e);
        router.push("/rooms");
        clear();
      }
    };

    getMissions();
  }, []);

  useEffect(() => {
    const spinRoulette = async () => {
      if (allMissions.length === 0) return;

      setIsRouletteLoading(true);

      const length = allMissions.length;
      const baseDeg = 360 * (5 + (Math.floor(Math.random() * 5) + 1));
      const finalDeg = baseDeg + (missionID - 1) * (360 / length);

      setRotateDeg(finalDeg);
      await delay(10000);

      setIsRouletteLoading(false);

      if (!currentUser?.isOwner) return;

      const request: STARTRequest = {
        roomID: Number(gameInfo?.roomID),
        event: "START",
        message: "",
      };

      ws?.send(JSON.stringify(request));
    };

    spinRoulette();
  }, [allMissions]);

  if (isRouletteLoading) {
    return (
      <div className="fixed z-30 w-full h-full bg-black/50 flex justify-center items-center">
        <div className="">
          <div
            className="w-64 h-64 rounded-full border-4 border-gray-400"
            style={{
              transform: `rotate(${rotateDeg}deg)`,
              transition: "transform 5s ease-out",
            }}
          >
            {[...Array(allMissions.length)].map((_, index) => (
              <div
                key={index}
                className="absolute w-1/2 h-1/2 top-0 left-1/2 origin-bottom"
                style={{
                  transform: `translateX(-50%) rotate(${
                    index * (360 / allMissions.length)
                  }deg)`,
                }}
              >
                <div className="w-full h-full bg-blue-500 flex items-center justify-center">
                  <span className="text-white font-bold">{index + 1}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (isResultLoading) {
    return <p>load missions</p>;
  }

  return <>{currentMission && <p>{currentMission.title}</p>}</>;
};

export default MissionPanel;
