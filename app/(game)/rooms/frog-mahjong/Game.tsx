"use client";

import { Dispatch, SetStateAction } from "react";
import { useTranslations } from "next-intl";
import useFrogMahjongStore from "@/utils/stores/frog-mahjong/useFrogMahjongStore";
import { getCookie } from "cookies-next";
import useSoundStore from "@/utils/stores/useSoundStore";
import ReadyStartText from "@/app/(game)/rooms/frog-mahjong/ReadyStartText";

type GameProps = {
  setIsHelpModal: Dispatch<SetStateAction<boolean>>;
};

const Game = ({ setIsHelpModal }: GameProps) => {
  const m = useTranslations("Game");
  const accessToken = getCookie("accessToken") as string;

  const { isStarted, ws, gameState, missions } = useFrogMahjongStore();

  const gameInfo = gameState?.gameInfo;
  const roomID = gameInfo?.roomID;
  const users = gameState?.users;

  const userID = getCookie("userID") as string;
  const currentUser = users?.find((user) => user.id === Number(userID))!;

  const audios = useSoundStore((s) => s.audios);

  return (
    <div>
      {isStarted ? (
        <>start missions: {JSON.stringify(missions)}</>
      ) : (
        <ReadyStartText />
      )}
    </div>
  );
};

export default Game;
