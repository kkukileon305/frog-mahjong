"use client";

import React, { Dispatch, SetStateAction } from "react";
import { useTranslations } from "next-intl";
import useFrogMahjongStore from "@/utils/stores/frog-mahjong/useFrogMahjongStore";
import MissionPanel from "@/app/(game)/rooms/frog-mahjong/MissionPanel";
import ChatForm from "@/app/(game)/rooms/frog-mahjong/ChatForm";
import MyCardBoard from "@/app/(game)/rooms/frog-mahjong/MyCardBoard";
import UserPanel from "@/app/(game)/rooms/frog-mahjong/UserPanel";
import PickCardsModal from "@/app/(game)/rooms/frog-mahjong/PickCardsModal";

const Game = () => {
  const m = useTranslations("Game");

  const { gameState, setIsHelpModalOpen } = useFrogMahjongStore((s) => ({
    gameState: s.gameState,
    setIsHelpModalOpen: s.setIsHelpModalOpen,
  }));
  const users = gameState?.users!;

  return (
    <>
      <div className="relative w-full h-[calc(100%-32px)] lg:h-[calc(100%-40px)] flex flex-col bg-game bg-cover bg-center p-2 lg:p-8">
        <div className="flex justify-center">
          <MissionPanel />
        </div>

        <div className="flex h-[calc(100%-128px)] flex-col">
          <div className="h-[calc(30%)] relative flex justify-center items-center p-2">
            <PickCardsModal inGame />
          </div>
          <div className="h-[calc(30%)] flex gap-4">
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

      <div className="flex h-8 lg:h-10 justify-end bg-[#ECB5C1]">
        <div className="basis-1/5" />

        <div className="basis-3/5 p-1">
          <ChatForm />
        </div>

        <div className="flex basis-1/5">
          <button
            onClick={() => setIsHelpModalOpen(true)}
            className="text-xs lg:text-base w-full bg-game-button font-bold"
          >
            {m("help")}
          </button>
        </div>
      </div>
    </>
  );
};

export default Game;
