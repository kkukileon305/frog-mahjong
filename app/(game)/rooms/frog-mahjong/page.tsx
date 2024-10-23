"use client";

import useScreenOrientation from "@/utils/hooks/useScreenOrientation";
import useDetectNavigation from "@/utils/hooks/useDetectNavigation";
import { getCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import useFrogMahjongStore from "@/utils/stores/frog-mahjong/useFrogMahjongStore";
import AbnormalExit from "@/app/(game)/rooms/quick-game/AbnormalExit";
import Entering from "@/app/(game)/rooms/quick-game/Entering";
import Game from "@/app/(game)/rooms/frog-mahjong/Game";
import ModalContainer from "@/utils/components/ModalContainer";
import WarningModal from "@/app/(game)/rooms/quick-game/WarningModal";
import PickCardsModal from "@/app/(game)/rooms/frog-mahjong/PickCardsModal";
import axiosInstance, { CardListResponse } from "@/utils/axios";
import { default as cardDataList } from "@/app/(game)/rooms/quick-game/game/cards";

const Page = () => {
  const orientation = useScreenOrientation();

  useDetectNavigation();

  const userID = getCookie("userID") as string;
  const accessToken = getCookie("accessToken") as string;

  const router = useRouter();
  const [isHelpModal, setIsHelpModal] = useState(false);
  const gameStore = useFrogMahjongStore();

  const currentUser = gameStore.gameState?.users?.find(
    (user) => user.id === Number(userID)
  );

  useEffect(() => {
    if (!gameStore.gameState?.gameInfo) {
      router.push("/rooms");
    }

    const getCards = async () => {
      const roomID = gameStore.gameState?.gameInfo?.roomID;

      if (!roomID) return;

      try {
        const {
          data: { cardIDList },
        } = await axiosInstance.get<CardListResponse>(
          `/v0.1/game/${roomID}/deck`,
          {
            headers: {
              tkn: accessToken,
            },
          }
        );

        const newCards = cardIDList.map(
          (cardID) => cardDataList.find((ci) => ci.id === cardID)!
        );
        gameStore.setCards(newCards);
      } catch (e) {
        router.push("/rooms");
        gameStore.clear();
      }
    };

    getCards();
  }, []);

  if (!gameStore.gameState?.gameInfo) {
    return <></>;
  }

  // abnormal
  if (gameStore.isAbnormalExit) {
    return <AbnormalExit />;
  }

  // loading
  if (!currentUser) {
    return <Entering />;
  }

  return (
    <div className="flex h-dvh overflow-hidden">
      <div className="relative w-full flex flex-col justify-between">
        {/*  結果モーダル*/}
        {/* ヘルプモーダル */}

        {/* pick cards modal */}
        {gameStore.isPickCardsModal && (
          <ModalContainer setIsOpen={gameStore.setIsPickCardsModal}>
            <PickCardsModal />
          </ModalContainer>
        )}

        {orientation === "portrait-primary" && (
          <ModalContainer>
            <WarningModal />
          </ModalContainer>
        )}

        <Game setIsHelpModal={setIsHelpModal} />
      </div>
    </div>
  );
};

export default Page;
