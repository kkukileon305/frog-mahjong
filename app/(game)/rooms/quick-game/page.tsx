"use client";

import { useRouter } from "next/navigation";
import useDetectNavigation from "@/utils/hooks/useDetectNavigation";
import AbnormalExit from "@/app/(game)/rooms/quick-game/AbnormalExit";
import Entering from "@/app/(game)/rooms/quick-game/Entering";
import LoanFailedModal from "@/app/(game)/rooms/quick-game/LoanFailedModal";
import ModalContainer from "@/utils/components/ModalContainer";
import ResultModal from "@/app/(game)/rooms/quick-game/ResultModal";
import HelpModal from "@/app/(game)/rooms/quick-game/HelpModal";
import { getCookie } from "cookies-next";
import { useEffect, useState } from "react";
import Game from "@/app/(game)/rooms/quick-game/game/Game";
import useGameStore from "@/utils/stores/useGameStore";
import useScreenOrientation from "@/utils/hooks/useScreenOrientation";
import WarningModal from "@/app/(game)/rooms/quick-game/WarningModal";

const Page = () => {
  const orientation = useScreenOrientation();

  useDetectNavigation();

  const userID = getCookie("userID") as string;

  const router = useRouter();
  const [isHelpModal, setIsHelpModal] = useState(false);
  const gameStore = useGameStore();

  const currentUser = gameStore.gameState?.users?.find(
    (user) => user.id === Number(userID)
  );

  useEffect(() => {
    if (!gameStore.gameState?.gameInfo) {
      router.push("/rooms");
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
        {gameStore.isLoanFailed !== 0 && (
          <LoanFailedModal
            isLoanFailed={gameStore.isLoanFailed}
            setIsLoanFailed={gameStore.setIsLoanFailed}
            users={gameStore.gameState?.users!}
          />
        )}

        {gameStore.isOpenResultModal && (
          <ModalContainer setIsOpen={gameStore.setIsOpenResultModal}>
            <ResultModal />
          </ModalContainer>
        )}

        {isHelpModal && (
          <ModalContainer setIsOpen={setIsHelpModal} customColor="bg-white/50">
            <HelpModal />
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
