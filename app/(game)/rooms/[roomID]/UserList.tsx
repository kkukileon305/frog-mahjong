"use client";

import { motion } from "framer-motion";
import { UserSocket } from "@/utils/socketTypes";

const UserList = ({ user }: { user: UserSocket }) => {
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
      <div className="h-16 p-2 bg-blue-400 text-white font-bold rounded-xl">
        <p>{user.name}</p>
        <p>{user.email}</p>
      </div>
    </motion.div>
  );
};

export default UserList;
