"use client";

import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import useFrogMahjongStore from "@/utils/stores/frog-mahjong/useFrogMahjongStore";
import { getCookie } from "cookies-next";
import useSoundStore from "@/utils/stores/useSoundStore";
import ReadyStartText from "@/app/(game)/rooms/frog-mahjong/ReadyStartText";
import MissionPanel from "@/app/(game)/rooms/frog-mahjong/MissionPanel";
import ChatForm from "@/app/(game)/rooms/frog-mahjong/ChatForm";
import MyCardBoard from "@/app/(game)/rooms/frog-mahjong/MyCardBoard";
import { CardImage } from "@/app/(game)/rooms/quick-game/game/cards";
import UserPanel from "@/app/(game)/rooms/frog-mahjong/UserPanel";
import PickCardsModal from "@/app/(game)/rooms/frog-mahjong/PickCardsModal";

type GameProps = {
  setIsHelpModal: Dispatch<SetStateAction<boolean>>;
};

const Game = ({ setIsHelpModal }: GameProps) => {
  const m = useTranslations("Game");
  const accessToken = getCookie("accessToken") as string;

  const { isStarted, ws, gameState, missions } = useFrogMahjongStore();

  const gameInfo = gameState?.gameInfo;
  const roomID = gameInfo?.roomID;
  const users = gameState?.users!;

  const userID = getCookie("userID") as string;
  const currentUser = users?.find((user) => user.id === Number(userID))!;

  const audios = useSoundStore((s) => s.audios);

  return (
    <>
      <div className="relative w-full h-[calc(100%-32px)] lg:h-[calc(100%-40px)] flex flex-col bg-game bg-cover bg-center p-2 lg:p-8 gap-4">
        <div className="flex justify-center">
          <MissionPanel />
        </div>

        <div className="flex gap-2 h-full">
          <div className="basis-1/2 relative">
            <PickCardsModal inGame />
          </div>
          <div className="basis-1/2 flex flex-col h-full">
            <div className="h-1/4">
              <UserPanel user={users[0]} />
            </div>
            <div className="h-1/4">
              <UserPanel user={users[1]} />
            </div>
            <div className="h-1/4">
              <UserPanel user={users[2]} />
            </div>
            <div className="h-1/4">
              <UserPanel user={users[3]} />
            </div>
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
