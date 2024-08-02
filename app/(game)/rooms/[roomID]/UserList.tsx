"use client";

import { motion } from "framer-motion";
import { UserSocket } from "@/utils/socketTypes";

type UserListProps = {
  user: UserSocket;
  currentUserID: string;
};

const UserList = ({ user, currentUserID }: UserListProps) => {
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
            {currentUserID === user.id.toString() && (
              <p className="text-black px-1 rounded-xl bg-white text-sm flex justify-center items-center">
                ME
              </p>
            )}
          </div>
          <p>{user.email}</p>
        </div>
        <p className="text-2xl">{user.playerState}</p>
      </div>
    </motion.div>
  );
};

export default UserList;
