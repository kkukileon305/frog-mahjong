"use client";

import React from "react";
import ConnectForm from "@/app/(game)/rooms/[roomId]/ConnectForm";
import useWebsocket from "@/app/hooks/useWebsocket";

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
          <ConnectForm ws={ws} accessToken={accessToken} roomId={roomId} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-64px)]">
      <ul>
        {users.map((user) => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default Page;
