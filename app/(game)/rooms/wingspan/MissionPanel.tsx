"use client";
import useWingspanStore from "@/utils/stores/wingspan/useWingspanStore";
import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { getCookie } from "cookies-next";
import { getSuccessCardIds } from "@/utils/functions/wingspan/checkMissions";

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
    gameStore.currentMissions
  );

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
