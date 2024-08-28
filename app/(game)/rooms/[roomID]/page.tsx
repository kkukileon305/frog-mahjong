"use client";

import React from "react";
import useWebsocket from "@/app/hooks/useWebsocket";
import CloseBtn from "@/app/(game)/rooms/[roomID]/CloseBtn";
import UserList from "@/app/(game)/rooms/[roomID]/UserList";
import { AnimatePresence } from "framer-motion";
import ReadyBtn from "@/app/(game)/rooms/[roomID]/ReadyBtn";
import Game from "@/app/(game)/rooms/[roomID]/game/Game";
import EnterFailedDiv from "@/app/(game)/rooms/[roomID]/EnterFailedDiv";
import EnteringDiv from "@/app/(game)/rooms/[roomID]/EnteringDiv";
import StartBtn from "@/app/(game)/rooms/[roomID]/StartBtn";
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
    <div className="flex h-[calc(100vh-64px)]">
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
        <div>
          <div className="w-full h-[80px] flex">
            <AnimatePresence>
              {users?.map((user) => (
                <UserList
                  key={user.id}
                  user={user}
                  currentUser={currentUser}
                  roomID={roomID}
                  ws={ws}
                  isStarted={isStarted}
                />
              ))}
            </AnimatePresence>
          </div>
          <div className="h-[80px] flex p-2 gap-2">
            {isStarted ? (
              <div className="flex items-center justify-center w-full bg-gray-400 rounded-xl">
                진행중
              </div>
            ) : (
              <>
                <CloseBtn ws={ws} roomID={roomID} userID={Number(userID)} />
                {currentUser.isOwner ? (
                  <StartBtn gameInfo={gameInfo} ws={ws} roomID={roomID} />
                ) : (
                  <ReadyBtn ws={ws} roomID={roomID} currentUser={currentUser} />
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
