"use client";

import React from "react";
import useFrogMahjongStore from "@/utils/stores/frog-mahjong/useFrogMahjongStore";

const DisconnectedModal = () => {
  const disconnectedUsers = useFrogMahjongStore((s) => s.disconnectedUsers);

  return (
    <div className="fixed w-full h-full z-[9999] bg-black/50 text-white flex justify-center items-center">
      {disconnectedUsers.map((u) => u.name)}님의 유저 재접속 대기중...
    </div>
  );
};

export default DisconnectedModal;
