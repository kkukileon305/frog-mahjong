"use client";

import useDetectNavigation from "@/utils/hooks/useDetectNavigation";
import { getCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import useFrogMahjongStore from "@/utils/stores/frog-mahjong/useFrogMahjongStore";
import AbnormalExit from "@/app/(game)/rooms/quick-game/AbnormalExit";
import Entering from "@/app/(game)/rooms/quick-game/Entering";
import Game from "@/app/(game)/rooms/frog-mahjong/Game";
import PickCardsModal from "@/app/(game)/rooms/frog-mahjong/PickCardsModal";
import axiosInstance, {
  BirdCard,
  ImportCardBody,
  Mission,
  MissionResponse,
} from "@/utils/axios";
import ResultModal from "@/app/(game)/rooms/frog-mahjong/ResultModal";
import useTimer from "@/utils/hooks/frog-mahjong/useTimer";
import HelpModal from "@/app/(game)/rooms/frog-mahjong/HelpModal";
import Roulette from "@/app/(game)/rooms/frog-mahjong/Roulette";

const Page = () => {
  useDetectNavigation();
  useTimer();

  const isHelpModalOpen = useFrogMahjongStore((s) => s.isHelpModalOpen);

  const userID = getCookie("userID") as string;
  const accessToken = getCookie("accessToken") as string;

  const router = useRouter();
  const gameStore = useFrogMahjongStore();

  const currentUser = gameStore.gameState?.users?.find(
    (user) => user.id === Number(userID)
  );

  useEffect(() => {
    if (!gameStore.gameState?.gameInfo) {
      router.push("/rooms");

      return;
    } else {
      const sessionID = gameStore.sessionID;
      const mode = gameStore.mode;

      if (sessionID && mode) {
        localStorage.setItem("sessionID", sessionID);
        localStorage.setItem("matchMode", mode);
      }
    }
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
          <ResultModal setIsOpen={gameStore.setIsOpenResultModal} />
        )}

        {/* pick cards modal */}
        {gameStore.isPickCardsModal && <PickCardsModal />}

        {/* help modal */}
        {isHelpModalOpen && <HelpModal />}

        {/* roulette */}
        {gameStore.isRouletteLoading && <Roulette />}

        <Game />
      </div>
    </div>
  );
};

export default Page;
