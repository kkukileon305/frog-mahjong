"use client";

import React from "react";
import useWingspanStore from "@/utils/stores/wingspan/useWingspanStore";

const DisconnectedModal = () => {
  const disconnectedUsers = useWingspanStore((s) => s.disconnectedUsers);

  return (
    <div className="fixed w-full h-full z-[9999] bg-black/50 text-white flex justify-center items-center">
      {disconnectedUsers.map((u) => u.name)}님의 유저 재접속 대기중...
    </div>
  );
};

export default DisconnectedModal;
