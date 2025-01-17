"use client";

import React, { useEffect, useRef, useState } from "react";
import RouletteLoading from "@/public/effects/roulette_loading.gif";
import Roulette0 from "@/public/effects/roulette0.png";
import Roulette1 from "@/public/effects/roulette1.png";
import Roulette2 from "@/public/effects/roulette2.png";
import Roulette3 from "@/public/effects/roulette3.png";
import delay from "@/utils/functions/delay";
import { STARTRequest } from "@/utils/constants/wingspan/socketTypes";
import useWingspanStore from "@/utils/stores/wingspan/useWingspanStore";
import { getCookie } from "cookies-next";
import useMatchSettingStore from "@/utils/stores/useMatchSettingStore";

const Roulette = () => {
  const gameStore = useWingspanStore();
  const mode = useMatchSettingStore((s) => s.mode);
  const currentMissions = gameStore.allMissions.filter((m) =>
    gameStore.gameState?.gameInfo?.missionIDs?.includes(m.id)
  );

  const userID = getCookie("userID") as string;
  const currentUser = gameStore.gameState?.users?.find(
    (user) => user.id === Number(userID)
  );

  // 룰렛효과
  const [step, setStep] = useState(0);
  const slidingContainer = useRef<HTMLDivElement>(null);

  const rouletteSteps = [Roulette0, Roulette1, Roulette2, Roulette3];

  const allTitles = gameStore.allMissions;
  const lieTitles = [...allTitles, ...allTitles];

  const titles = currentMissions;

  const indexes = currentMissions.map((_, idx) =>
    gameStore.allMissions.findIndex((m) => m.id === currentMissions[idx].id)
  );

  const titleIndexes = [
    allTitles.length + indexes[0],
    +indexes[1],
    allTitles.length + indexes[2],
  ];

  useEffect(() => {
    const spinRoulette = async () => {
      if (gameStore.allMissions.length === 0) return;

      slidingContainer.current &&
        (slidingContainer.current.style.transform = `translateY(0%)`);

      await delay(10);

      slidingContainer.current &&
        (slidingContainer.current.style.transform = `translateY(-${titleIndexes[0]}00%)`);
      await delay(1000);
      setStep(1);

      await delay(1000);

      slidingContainer.current &&
        (slidingContainer.current.style.transform = `translateY(-${titleIndexes[1]}00%)`);
      await delay(1000);
      setStep(2);

      await delay(1000);

      slidingContainer.current &&
        (slidingContainer.current.style.transform = `translateY(-${titleIndexes[2]}00%)`);
      await delay(1000);
      setStep(3);

      await delay(5000);

      if (mode) {
        localStorage.setItem("matchMode", mode);
      }

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
    <div className="fixed top-0 left-0 w-full bg-[#FCE4C0] h-lvh justify-end items-center gap-12 flex flex-col p-4 z-30">
      <div className="max-w-[370px] overflow-hidden">
        <div className="relative">
          <p className="absolute top-[5%] left-1/2 -translate-x-1/2 font-bold text-3xl text-[#FFA350]">
            랜덤미션
          </p>
          <img src={rouletteSteps[step].src} alt="rout1" />

          <div className="absolute left-1/2 -translate-x-1/2 w-[80%] top-[28%] h-[22%] overflow-hidden">
            <div
              ref={slidingContainer}
              className="h-full transition-transform duration-1000"
              style={{ transform: "translateY(0%)" }}
            >
              {lieTitles.map((mission, index) => (
                <div
                  key={index}
                  className="w-full text-center h-full font-bold flex items-center justify-center gap-2"
                >
                  <p>{mission.title}</p>

                  {mission.image && (
                    <img src={mission.image} alt="" className="w-5 h-5" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {titles.map((mission, idx) => (
            <div
              key={mission.id}
              className="w-[80%] text-nowrap overflow-hidden text-center absolute left-1/2 -translate-x-1/2"
              style={{
                bottom: `calc(${2 - idx}9%)`,
                display: idx < step ? "block" : "none",
              }}
            >
              <div className="font-bold flex items-center justify-center gap-2">
                <p className="text-[17px]">{mission.title}</p>

                {mission.image && (
                  <img src={mission.image} alt="" className="w-4 h-4" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Roulette;
