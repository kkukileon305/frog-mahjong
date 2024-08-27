"use client";

import { motion } from "framer-motion";
import { RoomOutBody, RoomOutRequest, UserSocket } from "@/utils/socketTypes";

type UserListProps = {
  user: UserSocket;
  currentUser: UserSocket;
  roomID: string;
  ws: WebSocket | null;
};

const UserList = ({ user, currentUser, roomID, ws }: UserListProps) => {
  const onClick = () => {
    const body: RoomOutBody = {
      targetUserID: user.id,
    };

    const request: RoomOutRequest = {
      userID: currentUser.id,
      roomID: Number(roomID),
      event: "ROOM_OUT",
      message: JSON.stringify(body),
    };

    ws?.send(JSON.stringify(request));
  };

  return (
    <motion.div
      className="w-1/4 p-2 h-full"
      initial={{
        opacity: 0,
        y: 30,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      exit={{
        opacity: 0,
        y: 30,
      }}
    >
      <div
        className={`h-16 flex justify-between items-center p-2 text-white font-bold rounded-xl ${
          user.isOwner ? "bg-pink-400" : "bg-blue-400"
        }`}
      >
        <div className="flex flex-col">
          <div className="flex gap-2">
            <p>{user.name}</p>
            {currentUser.id === user.id && (
              <p className="text-black px-1 rounded-xl bg-white text-sm flex justify-center items-center">
                ME
              </p>
            )}
          </div>
          <p>{user.coin}</p>
        </div>
        <div className="h-full flex flex-col justify-between items-end">
          {!user.isOwner && (
            <p className="">
              {user.playerState === "wait" ? "준비 안됨" : "준비"}
            </p>
          )}

          {currentUser.isOwner && user.id !== currentUser.id && (
            <button
              onClick={onClick}
              className="text-black px-1 rounded-xl bg-white text-sm"
            >
              강퇴
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default UserList;
