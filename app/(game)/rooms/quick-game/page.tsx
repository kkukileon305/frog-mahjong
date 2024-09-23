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

const Page = () => {
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
    <div className="flex h-dvh">
      <div className="w-full flex flex-col justify-between">
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
          <ModalContainer setIsOpen={setIsHelpModal} isInGame={true}>
            <HelpModal />
          </ModalContainer>
        )}

        <Game setIsHelpModal={setIsHelpModal} />
      </div>
    </div>
  );
};

export default Page;
