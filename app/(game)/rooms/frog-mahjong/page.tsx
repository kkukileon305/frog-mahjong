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
import axiosInstance, {
  BirdCard,
  CardListResponse,
  ImportCardBody,
} from "@/utils/axios";
import ResultModal from "@/app/(game)/rooms/frog-mahjong/ResultModal";

const Page = () => {
  useDetectNavigation();

  // 새로운 카드 에셋 로드 boolean
  const [isLoaded, setIsLoaded] = useState(false);

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

    // 카드 순서 불러와서 저장
    const getCards = async () => {
      const roomID = gameStore.gameState?.gameInfo?.roomID;

      if (!roomID) return;

      try {
        const {
          data: { cards },
        } = await axiosInstance.get<ImportCardBody>("/v2.1/game/cards", {
          headers: {
            tkn: accessToken,
          },
        });

        await Promise.all(
          cards.map(
            (card) =>
              new Promise<BirdCard>((res, rej) => {
                const img = new Image();

                img.src = card.image;
                img.onload = () => {
                  res(card);
                };
                img.onerror = () => {
                  rej(new Error(`Failed to load image ${card.image}`));
                };
              })
          )
        );

        setIsLoaded(true);
        gameStore.setCards(cards);
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
        {gameStore.isOpenResultModal && (
          <ModalContainer setIsOpen={gameStore.setIsOpenResultModal}>
            <ResultModal />
          </ModalContainer>
        )}

        {/* pick cards modal */}
        {gameStore.isPickCardsModal && <PickCardsModal />}

        {!isLoaded && (
          <div className="h-full flex justify-center items-center">
            <p>카드 정보 불러오는중</p>
          </div>
        )}

        {isLoaded && <Game setIsHelpModal={setIsHelpModal} />}
      </div>
    </div>
  );
};

export default Page;
