"use client";

import React from "react";
import { useTranslations } from "next-intl";
import useWingspanStore from "@/utils/stores/wingspan/useWingspanStore";
import MissionPanel from "@/app/(game)/rooms/wingspan/MissionPanel";
import ChatEmoji from "@/app/(game)/rooms/wingspan/ChatEmoji";
import MyCardBoard from "@/app/(game)/rooms/wingspan/MyCardBoard";
import UserPanel from "@/app/(game)/rooms/wingspan/UserPanel";
import PickCardsModal from "@/app/(game)/rooms/wingspan/PickCardsModal";
import Quest from "@/public/icons/quest.png";
import Setting from "@/public/icons/setting.png";

const Game = () => {
  const m = useTranslations("Game");

  const { gameState, setIsHelpModalOpen } = useWingspanStore((s) => ({
    gameState: s.gameState,
    setIsHelpModalOpen: s.setIsHelpModalOpen,
  }));
  const users = gameState?.users!;

  return (
    <>
      <div className="relative w-full h-[calc(100%-48px)] lg:h-[calc(100%-40px)] flex flex-col bg-cover bg-center p-2 lg:p-8">
        <div className="flex justify-center">
          <MissionPanel />
        </div>

        <div className="flex h-[calc(100%-108px)] flex-col">
          <div className="h-[calc(30%)] relative flex justify-center items-center p-2 pb-0">
            <PickCardsModal inGame />
          </div>
          <div className="h-[calc(30%)] flex gap-6">
            {users.map((user) => (
              <div key={user.id} className="w-[calc((100%-48px)/4)]">
                <UserPanel key={user.id} user={user} />
              </div>
            ))}
          </div>

          <div className="h-[calc(40%)] overflow-hidden">
            <MyCardBoard />
          </div>
        </div>
      </div>

      <div className="flex h-12 justify-end bg-white/40">
        <div className="w-3/4">
          <ChatEmoji />
        </div>

        <div className="flex w-1/4">
          <button
            onClick={() => setIsHelpModalOpen(true)}
            className="lg:text-base w-full font-bold flex justify-center items-center"
          >
            <img src={Quest.src} alt="" />
          </button>

          <button
            onClick={() => setIsHelpModalOpen(true)}
            className="lg:text-base w-full font-bold flex justify-center items-center"
          >
            <img src={Setting.src} alt="" />
          </button>
        </div>
      </div>
    </>
  );
};

export default Game;
