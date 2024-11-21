"use client";

import React, {
  Dispatch,
  MouseEventHandler,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { getCookie } from "cookies-next";
import { QUITRequest } from "@/utils/constants/frog-mahjong/socketTypes";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import useFrogMahjongStore from "@/utils/stores/frog-mahjong/useFrogMahjongStore";
import { QUIT_GAME } from "@/utils/constants/const";
import useSoundStore from "@/utils/stores/useSoundStore";
import useBlockScroll from "@/utils/hooks/useBlockScroll";
import axiosInstance, { Result } from "@/utils/axios";

const ResultModal = ({
  setIsOpen,
}: {
  setIsOpen: (isOpenResultModal: boolean) => void;
}) => {
  const m = useTranslations("ResultModal");

  const [result, setResult] = useState<Result | null>(null);

  const { winner: winnerID, clear, gameState, ws } = useFrogMahjongStore();

  const userID = getCookie("userID") as string;
  const accessToken = getCookie("accessToken") as string;
  const router = useRouter();

  const onClose: MouseEventHandler<HTMLDivElement> = (e) => {
    if ((e.target as HTMLElement).closest("#back")) {
      setIsOpen && setIsOpen(false);
    }
  };

  useBlockScroll();

  // sounds
  const audios = useSoundStore((s) => s.audios);

  const init = () => {
    clear();
    const quitReq: QUITRequest = {
      roomID: Number(gameState?.gameInfo?.roomID),
      event: QUIT_GAME,
      message: "",
      userID: Number(userID),
    };

    ws?.send(JSON.stringify(quitReq));
    router.push("/rooms");
  };

  const getResult = async () => {
    try {
      const winnerCount = Math.max(
        ...gameState?.users?.map((user) => user.missionSuccessCount)!
      );
      const winner = gameState?.users?.find(
        (user) => user.missionSuccessCount === winnerCount
      );

      const { data } = await axiosInstance.post<Result>(
        "/v2.1/game/result",
        {
          roomID: Number(gameState?.gameInfo?.roomID),
          userID: winner?.id,
        },
        {
          headers: {
            tkn: accessToken,
          },
        }
      );

      setResult(data);
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    getResult();
  }, []);

  return (
    <div
      className="absolute left-0 top-0 w-full h-[calc(100dvh)] bg-game z-30 flex justify-center items-center p-2"
      onClick={onClose}
    >
      <div className="p-4">
        <h3 className="text-3xl font-bold mb-8 text-center">{m("title")}</h3>
        <p>result</p>

        {!result && <p>loading...</p>}
        {result && <p>{JSON.stringify(result)}</p>}

        <button
          onClick={init}
          id="back"
          className="w-full bg-sky-500 rounded-lg py-3 text-white font-bold disabled:bg-gray-400"
        >
          {m("close")}
        </button>
      </div>
    </div>
  );
};

export default ResultModal;
