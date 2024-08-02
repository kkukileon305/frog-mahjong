"use client";

import React from "react";
import useWebsocket from "@/app/hooks/useWebsocket";
import CloseBtn from "@/app/(game)/rooms/[roomID]/CloseBtn";
import UserList from "@/app/(game)/rooms/[roomID]/UserList";
import Link from "next/link";
import { AnimatePresence } from "framer-motion";
import ReadyBtn from "@/app/(game)/rooms/[roomID]/ReadyBtn";
import Game from "@/app/(game)/rooms/[roomID]/game/Game";

type RoomDetailProps = {
  params: { roomID: string };
  searchParams: { password?: string };
};

const Page = ({
  params: { roomID },
  searchParams: { password },
}: RoomDetailProps) => {
  const { ws, users, userID, isEnterFailed, gameInfo } = useWebsocket(
    roomID,
    password
  );

  const currentUser = users?.find((user) => user.id === Number(userID));

  if (isEnterFailed) {
    return (
      <div className="flex h-[calc(100vh-64px)] bg-gray-200 justify-center items-center">
        <div className="p-4 w-full max-w-3xl bg-white rounded-xl flex justify-center items-center flex-col">
          <p className="font-bold text-3xl">비밀번호가 잘못되었습니다</p>
          <Link
            className="py-2 px-4 mt-4 border border-blue-400 rounded-xl text-blue-400 font-bold"
            href={"/rooms"}
          >
            돌아가기
          </Link>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="flex h-[calc(100vh-64px)] bg-gray-200 justify-center items-center">
        <div className="p-4 w-full max-w-3xl bg-white rounded-xl flex justify-center items-center">
          <p className="font-bold text-3xl">접속중</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-64px)]">
      <div className="w-full flex flex-col justify-between">
        <Game
          ws={ws}
          roomID={roomID}
          users={users}
          currentUser={currentUser}
          gameInfo={gameInfo}
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
            <CloseBtn ws={ws} roomID={roomID} />
            <ReadyBtn ws={ws} roomID={roomID} currentUser={currentUser} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
