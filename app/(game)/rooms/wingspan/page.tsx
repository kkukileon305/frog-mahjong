"use client";

import useDetectNavigation from "@/utils/hooks/useDetectNavigation";
import { getCookie } from "cookies-next";
import { redirect, useRouter } from "next/navigation";
import { useEffect } from "react";
import useWingspanStore from "@/utils/stores/wingspan/useWingspanStore";
import AbnormalExit from "@/app/(game)/rooms/quick-game/AbnormalExit";
import Entering from "@/app/(game)/rooms/quick-game/Entering";
import Game from "@/app/(game)/rooms/wingspan/Game";
import PickCardsModal from "@/app/(game)/rooms/wingspan/PickCardsModal";
import ResultModal from "@/app/(game)/rooms/wingspan/ResultModal";
import useTimer from "@/utils/hooks/wingspan/useTimer";
import HelpModal from "@/app/(game)/rooms/wingspan/HelpModal";
import Roulette from "@/app/(game)/rooms/wingspan/Roulette";
import { ERR_ABNORMAL_EXIT } from "@/utils/constants/const";
import DisconnectedModal from "@/app/(game)/rooms/wingspan/DisconnectedModal";
import SettingModal from "@/app/(game)/rooms/wingspan/SettingModal";
import useScreenOrientation from "@/utils/hooks/useScreenOrientation";
import ModalContainer from "@/utils/components/ModalContainer";
import WarningModal from "@/app/(game)/rooms/quick-game/WarningModal";

const Page = () => {
  useDetectNavigation();
  useTimer();

  const orientation = useScreenOrientation();

  const userID = getCookie("userID") as string;
  const accessToken = getCookie("accessToken") as string;

  const router = useRouter();
  const gameStore = useWingspanStore();

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
    <div className="flex h-dvh overflow-hidden bg-game">
      <div className="relative w-full flex flex-col justify-between">
        {orientation !== "portrait-primary" && (
          <ModalContainer>
            <WarningModal direction="세로" jaDirection="縦" />
          </ModalContainer>
        )}

        {isDisconnected && <DisconnectedModal />}

        {/* setting modal*/}
        {gameStore.isSettingModalOpen && <SettingModal />}

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
