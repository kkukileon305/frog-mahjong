"use client";

import React, { Dispatch, SetStateAction } from "react";
import { useTranslations } from "next-intl";
import useFrogMahjongStore from "@/utils/stores/frog-mahjong/useFrogMahjongStore";
import MissionPanel from "@/app/(game)/rooms/frog-mahjong/MissionPanel";
import ChatForm from "@/app/(game)/rooms/frog-mahjong/ChatForm";
import MyCardBoard from "@/app/(game)/rooms/frog-mahjong/MyCardBoard";
import UserPanel from "@/app/(game)/rooms/frog-mahjong/UserPanel";
import PickCardsModal from "@/app/(game)/rooms/frog-mahjong/PickCardsModal";

type GameProps = {
  setIsHelpModal: Dispatch<SetStateAction<boolean>>;
};

const Game = ({ setIsHelpModal }: GameProps) => {
  const m = useTranslations("Game");

  const gameState = useFrogMahjongStore((s) => s.gameState);
  const users = gameState?.users!;

  return (
    <>
      <div className="relative w-full h-[calc(100%-32px)] lg:h-[calc(100%-40px)] flex flex-col bg-game bg-cover bg-center p-2 lg:p-8 gap-4">
        <div className="flex justify-center">
          <MissionPanel />
        </div>

        <div className="flex gap-2 h-full flex-col">
          <div className="basis-1/2 relative flex justify-center items-center">
            <PickCardsModal inGame />
          </div>
          <div className="basis-1/2 h-full grid grid-cols-2 grid-rows-2 gap-4">
            {users.map((user) => (
              <div key={user.id}>
                <UserPanel key={user.id} user={user} />
              </div>
            ))}
          </div>
        </div>

        <MyCardBoard />
      </div>

      <div className="flex h-8 lg:h-10 justify-end bg-game-bar">
        <div className="basis-1/5" />

        <div className="basis-3/5 p-1">
          <ChatForm />
        </div>

        <div className="flex basis-1/5">
          <button
            onClick={() => setIsHelpModal(true)}
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
