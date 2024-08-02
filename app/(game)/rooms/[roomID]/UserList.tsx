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
        className={`h-16 p-2 text-white font-bold rounded-xl ${
          user.isOwner ? "bg-pink-400" : "bg-blue-400"
        }`}
      >
        <div className="flex justify-between">
          <p>{user.name}</p>
          {currentUserID === user.id.toString() && (
            <p className="text-black bg-white px-2 rounded-xl">ME</p>
          )}
        </div>
        <p>{user.email}</p>
      </div>
    </motion.div>
  );
};

export default UserList;
