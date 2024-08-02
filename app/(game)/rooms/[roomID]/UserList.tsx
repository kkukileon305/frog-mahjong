"use client";

import { motion } from "framer-motion";
import { UserSocket } from "@/utils/socketTypes";

const UserList = ({ user }: { user: UserSocket }) => {
  return (
    <>
      <motion.div
        className="p-2 bg-blue-400 text-white font-bold rounded-xl mb-2"
        initial={{
          opacity: 0,
          x: -300,
        }}
        animate={{
          opacity: 1,
          x: 0,
        }}
        exit={{
          opacity: 0,
          x: -300,
        }}
      >
        <p>{user.name}</p>
        <p>{user.email}</p>
      </motion.div>
    </>
  );
};

export default UserList;
