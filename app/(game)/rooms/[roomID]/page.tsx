"use client";

import React from "react";
import useWebsocket from "@/app/hooks/useWebsocket";
import Game from "@/app/(game)/rooms/[roomID]/game/Game";
import EnteringDiv from "@/app/(game)/rooms/[roomID]/EnteringDiv";
import AbnormalExit from "@/app/(game)/rooms/[roomID]/AbnormalExit";
import ResultModal from "@/app/(game)/rooms/[roomID]/ResultModal";
import KickedGame from "@/app/(game)/rooms/[roomID]/Kicked";
import JoinError from "@/app/(game)/rooms/[roomID]/JoinError";

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
  } = useWebsocket(roomID, password);

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
        {result.isShowModal && (
          <ResultModal result={result} setResult={setResult} roomID={roomID} />
        )}

        <Game
          ws={ws}
          roomID={roomID}
          users={users}
          currentUser={currentUser}
          gameInfo={gameInfo}
          isStarted={isStarted}
        />
      </div>
    </div>
  );
};

export default Page;
