"use client";

import useQuickMatching from "@/utils/hooks/useQuickMatching";
import { useRouter } from "next/navigation";
import useDetectNavigation from "@/utils/hooks/useDetectNavigation";
import AbnormalExit from "@/app/(game)/rooms/quick-game/AbnormalExit";
import KickedGame from "@/app/(game)/rooms/quick-game/Kicked";
import Entering from "@/app/(game)/rooms/quick-game/Entering";
import LoanFailedModal from "@/app/(game)/rooms/quick-game/LoanFailedModal";
import ModalContainer from "@/utils/components/ModalContainer";
import ResultModal from "@/app/(game)/rooms/quick-game/ResultModal";
import HelpModal from "@/app/(game)/rooms/quick-game/HelpModal";

import { getCookie } from "cookies-next";
import { useState } from "react";
import Game from "@/app/(game)/rooms/[roomID]/game/Game";

const Page = () => {
  useDetectNavigation();
  const userID = getCookie("userID") as string;

  const router = useRouter();
  const [isHelpModal, setIsHelpModal] = useState(false);
  const quickMatching = useQuickMatching();

  const currentUser = quickMatching.users?.find(
    (user) => user.id === Number(userID)
  );

  if (quickMatching.gameInfo === null) {
    return router.push("/rooms");
  }

  // abnormal
  if (quickMatching.errors.isAbnormalExit) {
    return <AbnormalExit />;
  }

  // kick
  if (quickMatching.errors.kicked) {
    return <KickedGame />;
  }

  // loading
  if (!currentUser) {
    return <Entering />;
  }

  return (
    <div className="flex h-dvh">
      <div className="w-full flex flex-col justify-between">
        {quickMatching.errors.isLoanFailed !== 0 && (
          <LoanFailedModal
            isLoanFailed={quickMatching.errors.isLoanFailed}
            setIsLoanFailed={quickMatching.errors.setIsLoanFailed}
            users={quickMatching.users}
          />
        )}

        {quickMatching.isOpenResultModal && (
          <ModalContainer setIsOpen={quickMatching.setIsOpenResultModal}>
            <ResultModal
              result={quickMatching.result}
              setResult={quickMatching.setResult}
              roomID={quickMatching.gameInfo.roomID}
              winner={quickMatching.winner}
              setWinner={quickMatching.setWinner}
            />
          </ModalContainer>
        )}

        {isHelpModal && (
          <ModalContainer setIsOpen={setIsHelpModal} isInGame={true}>
            <HelpModal />
          </ModalContainer>
        )}

        <Game
          ws={quickMatching.ws}
          roomID={Number(quickMatching.gameInfo.roomID)}
          users={quickMatching.users}
          currentUser={currentUser}
          gameInfo={quickMatching.gameInfo}
          isStarted={quickMatching.isStarted}
          setWinner={quickMatching.setWinner}
          setIsHelpModal={setIsHelpModal}
          chatList={quickMatching.chatList}
          isGetCard={quickMatching.isGetCard}
        />
      </div>
    </div>
  );
};

export default Page;
