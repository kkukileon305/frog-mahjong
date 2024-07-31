"use client";

import React from "react";
import ConnectForm from "@/app/(game)/rooms/[roomId]/ConnectForm";
import useWebsocket from "@/app/hooks/useWebsocket";
import CloseBtn from "@/app/(game)/rooms/[roomId]/CloseBtn";
import UserList from "@/app/(game)/rooms/[roomId]/UserList";

type RoomDetailProps = {
  params: { roomId: string };
};

const Page = ({ params: { roomId } }: RoomDetailProps) => {
  const { ws, accessToken, users, userID } = useWebsocket(roomId);

  const isConnected = users.find((user) => user.id === Number(userID));

  if (!isConnected) {
    return (
      <div className="flex h-[calc(100vh-64px)] bg-gray-200 justify-center items-center">
        <div className="w-full max-w-3xl bg-white rounded-xl">
          <ConnectForm ws={ws} roomId={roomId} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-64px)]">
      <div className="w-[300px] flex flex-col justify-between">
        <ul className="w-full p-2">
          {users.map((user) => (
            <UserList key={user.id} user={user} />
          ))}
        </ul>

        <CloseBtn ws={ws} roomId={roomId} />
      </div>
    </div>
  );
};

export default Page;
