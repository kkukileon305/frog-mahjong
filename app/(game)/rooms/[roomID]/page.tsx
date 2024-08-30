"use client";

import useWebsocket from "@/app/hooks/useWebsocket";
import Game from "@/app/(game)/rooms/[roomID]/game/Game";
import EnteringDiv from "@/app/(game)/rooms/[roomID]/EnteringDiv";
import AbnormalExit from "@/app/(game)/rooms/[roomID]/AbnormalExit";
import ResultModal from "@/app/(game)/rooms/[roomID]/ResultModal";
import KickedGame from "@/app/(game)/rooms/[roomID]/Kicked";
import JoinError from "@/app/(game)/rooms/[roomID]/JoinError";
import LoanFailedModal from "@/app/(game)/rooms/[roomID]/LoanFailedModal";
import { useEffect } from "react";
import useDetectNavigation from "@/app/hooks/useDetectNavigation";

type RoomDetailProps = {
  params: { roomID: string };
  searchParams: { password?: string };
};

const Page = ({
  params: { roomID },
  searchParams: { password },
}: RoomDetailProps) => {
  const {
    ws, //
    users,
    userID,
    gameInfo,
    isStarted,
    result,
    setResult,
    kicked,
    isAbnormalExit,
    isPasswordFailed,
    isProgress,
    isFullPlayer,
    isNoRoom,
    winner,
    setWinner,
    setIsLoanFailed,
    isLoanFailed,
  } = useWebsocket(roomID, password);

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

        {result.isShowModal && (
          <ResultModal
            result={result}
            setResult={setResult}
            roomID={roomID}
            winner={winner}
            setWinner={setWinner}
          />
        )}

        <Game
          ws={ws}
          roomID={roomID}
          users={users}
          currentUser={currentUser}
          gameInfo={gameInfo}
          isStarted={isStarted}
          setWinner={setWinner}
        />
      </div>
    </div>
  );
};

export default Page;
