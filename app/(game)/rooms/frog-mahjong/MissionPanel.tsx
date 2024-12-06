"use client";
import useFrogMahjongStore from "@/utils/stores/frog-mahjong/useFrogMahjongStore";
import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { getCookie } from "cookies-next";
import axiosInstance, { MissionResponse } from "@/utils/axios";
import { STARTRequest } from "@/utils/constants/frog-mahjong/socketTypes";
import delay from "@/utils/functions/delay";
import { getSuccessCardIds } from "@/utils/functions/frog-mahjong/checkMissions";
import RouletteLoading from "@/public/effects/roulette_loading.gif";
import Roulette1 from "@/public/effects/roulette1.png";
import Roulette2 from "@/public/effects/roulette2.png";
import Roulette3 from "@/public/effects/roulette3.png";

const MissionPanel = () => {
  const router = useRouter();
  const userID = getCookie("userID") as string;

  const gameStore = useFrogMahjongStore();

  const m = useTranslations("Game");

  const currentUser = gameStore.gameState?.users?.find(
    (user) => user.id === Number(userID)
  );

  const currentMissions = gameStore.allMissions.filter((m) =>
    gameStore.gameState?.gameInfo?.missionIDs?.includes(m.id)
  );

  useEffect(() => {
    if (!currentUser || gameStore.isGameEnd) return;
    gameStore.setIsRouletteLoading(true);

    const getMissions = async () => {
      try {
        const { data } = await axiosInstance.get<MissionResponse>(
          "/v2.1/game/missions"
        );

        gameStore.setAllMissions(data.missions);
      } catch (e) {
        console.log(e);
        router.push("/rooms");
        gameStore.clear();
      }
    };

    getMissions();
  }, []);

  // 남은 카드들중 미션에 부합하는거 표시
  const users = gameStore.gameState?.users!;

  const allUserCardIds = users
    ?.map((user) => (user.cards ? user.cards.map((card) => card.cardID) : []))
    .flat();

  const allUserPickedCardIds = users
    ?.map((user) =>
      user.pickedCards ? user.pickedCards.map((card) => card.cardID) : []
    )
    .flat();

  const allUserCardWithoutPickedCardIds = allUserCardIds.filter(
    (id) => !allUserPickedCardIds.includes(id)
  );

  const allUserDiscardedIds = users
    ?.map((user) =>
      user.discardedCards ? user.discardedCards.map((card) => card.cardID) : []
    )
    .flat();

  const leftCardsWithoutPickedWithOpenCards = gameStore.cards.filter(
    (card) =>
      !(
        allUserCardIds?.includes(card.id) ||
        allUserCardWithoutPickedCardIds?.includes(card.id) ||
        allUserDiscardedIds?.includes(card.id)
      )
  );

  const nokoriPassCards = getSuccessCardIds(
    leftCardsWithoutPickedWithOpenCards,
    currentMissions
  );

  return (
    <div className="w-full bg-white/50 rounded-xl p-1 border-[#796858] border-4">
      <div className="">
        <p className="p-1 basis-1/6 text-sm bg-[#FA4E38] rounded-xl font-bold text-white text-center">
          {m("mission")}
        </p>

        <div className="py-2 px-4">
          {currentMissions &&
            currentMissions.map((m, index) => (
              <div
                key={m.id}
                className={`flex justify-between basis-5/6 font-bold text-xs text-black ${
                  gameStore.clearMissionIDs.includes(m.id) && "line-through"
                }`}
              >
                <p>
                  {index + 1}. {m.title}
                </p>
                <p>{nokoriPassCards[index].length}</p>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default MissionPanel;
