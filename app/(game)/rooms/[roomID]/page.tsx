"use client";

import React from "react";
import useWebsocket from "@/app/hooks/useWebsocket";
import CloseBtn from "@/app/(game)/rooms/[roomID]/CloseBtn";
import UserList from "@/app/(game)/rooms/[roomID]/UserList";
import Link from "next/link";
import { AnimatePresence } from "framer-motion";

type RoomDetailProps = {
  params: { roomID: string };
  searchParams: { password?: string };
};

const Page = ({
  params: { roomID },
  searchParams: { password },
}: RoomDetailProps) => {
  const { ws, users, userID, isEnterFailed } = useWebsocket(roomID, password);

  const isConnected = users?.find((user) => user.id === Number(userID));

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

  if (!isConnected) {
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
      <div className="w-[300px] flex flex-col justify-between">
        <div className="w-full p-2">
          <AnimatePresence>
            {users?.map((user) => (
              <UserList key={user.id} user={user} />
            ))}
          </AnimatePresence>
        </div>

        <CloseBtn ws={ws} roomID={roomID} />
      </div>
    </div>
  );
};

export default Page;
