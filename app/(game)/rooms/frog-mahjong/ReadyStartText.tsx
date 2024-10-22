"use client";

import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { getCookie } from "cookies-next";
import { STARTRequest } from "@/utils/constants/frog-mahjong/socketTypes";
import useFrogMahjongStore from "@/utils/stores/frog-mahjong/useFrogMahjongStore";
import axiosInstance, { MissionResponse } from "@/utils/axios";
import { useRouter } from "next/navigation";

const ReadyStartText = () => {
  const router = useRouter();
  const userID = getCookie("userID") as string;

  const { ws, users, gameInfo, isGameEnd, setMissions, clear } =
    useFrogMahjongStore((state) => ({
      ws: state.ws,
      users: state.gameState?.users,
      gameInfo: state.gameState?.gameInfo,
      isGameEnd: state.isGameEnd,
      setMissions: state.setMissions,
      clear: state.clear,
    }));

  const m = useTranslations("Game");

  const currentUser = users?.find((user) => user.id === Number(userID));

  useEffect(() => {
    if (!currentUser) return;

    const getMissions = async () => {
      try {
        const { data } = await axiosInstance.get<MissionResponse>(
          "/v0.1/game/missions"
        );

        setMissions(data.missions);

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
      } catch (e) {
        console.log(e);
        // router.push("/rooms");
        clear();
      }
    };

    getMissions();
  }, []);

  return <p>{m("ready")}</p>;
};

export default ReadyStartText;
