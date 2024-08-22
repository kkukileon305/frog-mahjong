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
    isEnterFailed,
    gameInfo,
    isStarted,
    isAbnormalExit,
    result,
    setResult,
  } = useWebsocket(roomID, password);

  const currentUser = users?.find((user) => user.id === Number(userID));

  if (isEnterFailed) {
    return <EnterFailedDiv />;
  }

  if (isAbnormalExit) {
    return <AbnormalExit />;
  }

  if (!currentUser) {
    return <EnteringDiv />;
  }

  return (
    <div className="flex h-[calc(100vh-64px)]">
      <div className="w-full flex flex-col justify-between relative">
        {result.isShow && (
          <div className="absolute flex justify-center items-center w-full h-full left-0 top-0 bg-black/50">
            <div className="bg-white max-w-3xl w-full rounded-xl p-4">
              <h3 className="text-3xl font-bold">결과</h3>

              <p className="my-4">
                {JSON.stringify(
                  users?.map((u) => ({ name: u.name, coin: u.coin }))
                )}
              </p>

              <button className="w-full bg-sky-500 rounded-lg py-3 text-white font-bold disabled:bg-gray-400">
                닫기
              </button>
            </div>
          </div>
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
                <UserList key={user.id} user={user} currentUser={currentUser} />
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
                <CloseBtn ws={ws} roomID={roomID} />
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
