"use client";

import { useTranslations } from "next-intl";
import useOldFrogMahjongStore from "@/utils/stores/old-frog-mahjong/useOldFrogMahjongStore";
import { useEffect } from "react";
import { getCookie } from "cookies-next";
import { STARTRequest } from "@/utils/constants/old-frog-mahjong/socketTypes";

const ReadyStartText = () => {
  const userID = getCookie("userID") as string;

  const { ws, users, gameInfo, isGameEnd } = useOldFrogMahjongStore(
    (state) => ({
      ws: state.ws,
      users: state.gameState?.users,
      gameInfo: state.gameState?.gameInfo,
      isGameEnd: state.isGameEnd,
    })
  );

  const m = useTranslations("Game");

  const currentUser = users?.find((user) => user.id === Number(userID));

  useEffect(() => {
    if (!currentUser) return;
    if (!currentUser.isOwner) return;
    if (isGameEnd) return;

    const timeout = setTimeout(() => {
      const request: STARTRequest = {
        roomID: Number(gameInfo?.roomID),
        event: "START",
        message: "",
      };

      ws?.send(JSON.stringify(request));
    }, 3000);

    return () => clearTimeout(timeout);
  }, []);

  return <p>{m("ready")}</p>;
};

export default ReadyStartText;
