"use client";

import useDetectNavigation from "@/utils/hooks/useDetectNavigation";
import { getCookie } from "cookies-next";
import { redirect, useRouter } from "next/navigation";
import { useEffect } from "react";
import useFrogMahjongStore from "@/utils/stores/frog-mahjong/useFrogMahjongStore";
import AbnormalExit from "@/app/(game)/rooms/quick-game/AbnormalExit";
import Entering from "@/app/(game)/rooms/quick-game/Entering";
import Game from "@/app/(game)/rooms/frog-mahjong/Game";
import PickCardsModal from "@/app/(game)/rooms/frog-mahjong/PickCardsModal";
import ResultModal from "@/app/(game)/rooms/frog-mahjong/ResultModal";
import useTimer from "@/utils/hooks/frog-mahjong/useTimer";
import HelpModal from "@/app/(game)/rooms/frog-mahjong/HelpModal";
import Roulette from "@/app/(game)/rooms/frog-mahjong/Roulette";
import { ERR_ABNORMAL_EXIT } from "@/utils/constants/const";
import DisconnectedModal from "@/app/(game)/rooms/frog-mahjong/DisconnectedModal";

const Page = () => {
  useDetectNavigation();
  useTimer();

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
    }
  }, []);

  if (
    !gameStore.gameState?.gameInfo &&
    gameStore.gameState?.errorInfo?.type !== ERR_ABNORMAL_EXIT
  ) {
    redirect("/rooms");
  }

  // abnormal
  if (gameStore.isAbnormalExit) {
    return <AbnormalExit />;
  }

  // loading
  if (!currentUser) {
    return <Entering />;
  }

  const isDisconnected = gameStore.disconnectedUsers.length > 0;

  return (
    <div className="flex h-dvh overflow-hidden">
      <div className="relative w-full flex flex-col justify-between">
        {isDisconnected && <DisconnectedModal />}

        {/* result modal */}
        {gameStore.isOpenResultModal && <ResultModal />}

        {/* pick cards modal */}
        {gameStore.isPickCardsModal && <PickCardsModal />}

        {/* help modal */}
        {gameStore.isHelpModalOpen && <HelpModal />}

        {/* roulette */}
        {gameStore.isRouletteLoading && <Roulette />}

        <Game />
      </div>
    </div>
  );
};

export default Page;
