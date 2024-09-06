"use client";

import useWebsocket from "@/app/hooks/useWebsocket";
import Game from "@/app/(game)/rooms/[roomID]/game/Game";
import EnteringDiv from "@/app/(game)/rooms/[roomID]/EnteringDiv";
import AbnormalExit from "@/app/(game)/rooms/[roomID]/AbnormalExit";
import ResultModal from "@/app/(game)/rooms/[roomID]/ResultModal";
import KickedGame from "@/app/(game)/rooms/[roomID]/Kicked";
import JoinError from "@/app/(game)/rooms/[roomID]/JoinError";
import LoanFailedModal from "@/app/(game)/rooms/[roomID]/LoanFailedModal";
import { useEffect, useState } from "react";
import useDetectNavigation from "@/app/hooks/useDetectNavigation";
import HelpModal from "@/app/(game)/rooms/[roomID]/HelpModal";
import ModalContainer from "@/utils/ModalContainer";

type RoomDetailProps = {
  params: { roomID: string };
  searchParams: { password?: string };
};

const Page = ({
  params: { roomID },
  searchParams: { password },
}: RoomDetailProps) => {
  const {
    ws,
    users,
    userID,
    gameInfo,
    isStarted,
    result,
    setResult,
    winner,
    setWinner,
    chatList,
    setIsOpenResultModal,
    isOpenResultModal,
    errors: {
      kicked,
      isAbnormalExit,
      isPasswordFailed,
      isProgress,
      isFullPlayer,
      isNoRoom,
      isLoanFailed,
      setIsLoanFailed,
    },
  } = useWebsocket(roomID, password);

  const [isHelpModal, setIsHelpModal] = useState(false);

  useEffect(() => {
    setIsHelpModal(false);
  }, [gameInfo]);

  useDetectNavigation();

  const currentUser = users?.find((user) => user.id === Number(userID));

  // join
  if (isPasswordFailed || isProgress || isFullPlayer || isNoRoom) {
    return (
      <JoinError
        isPasswordFailed={isPasswordFailed}
        isProgress={isProgress}
        isFullPlayer={isFullPlayer}
        isNoRoom={isNoRoom}
      />
    );
  }

  // abnormal
  if (isAbnormalExit) {
    return <AbnormalExit />;
  }

  // kick
  if (kicked) {
    return <KickedGame />;
  }

  // loading
  if (!currentUser) {
    return <EnteringDiv />;
  }

  return (
    <div className="flex h-dvh">
      <div className="w-full flex flex-col justify-between">
        {isLoanFailed !== 0 && (
          <LoanFailedModal
            isLoanFailed={isLoanFailed}
            setIsLoanFailed={setIsLoanFailed}
            users={users}
          />
        )}

        {isOpenResultModal && (
          <ModalContainer setIsOpen={setIsOpenResultModal}>
            <ResultModal
              result={result}
              setResult={setResult}
              roomID={roomID}
              winner={winner}
              setWinner={setWinner}
            />
          </ModalContainer>
        )}

        {isHelpModal && (
          <ModalContainer setIsOpen={setIsHelpModal} isInGame>
            <HelpModal />
          </ModalContainer>
        )}

        <Game
          ws={ws}
          roomID={roomID}
          users={users}
          currentUser={currentUser}
          gameInfo={gameInfo}
          isStarted={isStarted}
          setWinner={setWinner}
          setIsHelpModal={setIsHelpModal}
          chatList={chatList}
        />
      </div>
    </div>
  );
};

export default Page;
