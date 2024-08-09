"use client";

import { UserSocket } from "@/utils/socketTypes";

type OtherCard = {
  user?: UserSocket;
  playTurn?: number;
};

const OtherCards = ({ user, playTurn }: OtherCard) => {
  return (
    <div
      className={`${user?.turnNumber === playTurn ? "bg-red-400" : "bg-white"}`}
    >
      {user?.name}
    </div>
  );
};

export default OtherCards;
