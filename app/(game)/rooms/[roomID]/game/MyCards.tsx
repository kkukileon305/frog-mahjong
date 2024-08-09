"use client";

import { UserSocket } from "@/utils/socketTypes";

type MyCardProps = {
  user?: UserSocket;
  isUserTurn: boolean;
};

const MyCards = ({ user, isUserTurn }: MyCardProps) => {
  return (
    <div className={isUserTurn ? "bg-red-400" : "bg-white"}>
      <p>ME</p>
      {JSON.stringify(user)}
    </div>
  );
};

export default MyCards;
