"use client";

import { QUITRequest } from "@/utils/constants/socketTypes";
import { useRouter } from "next/navigation";
import { QUIT_GAME } from "@/utils/constants/const";
import { useTranslations } from "next-intl";

type CloseBtnProps = {
  ws: WebSocket | null;
  roomID: string;
  userID: number;
};

const CloseBtn = ({ ws, roomID, userID }: CloseBtnProps) => {
  const m = useTranslations("Game");

  const router = useRouter();
  const onClick = () => {
    const quitReq: QUITRequest = {
      roomID: Number(roomID),
      event: QUIT_GAME,
      message: "",
      userID,
    };

    ws?.send(JSON.stringify(quitReq));
    router.push("/rooms");
  };

  return (
    <button
      onClick={onClick}
      className="bg-red-400 text-white font-bold p-2 w-full"
    >
      {m("quit")}
    </button>
  );
};

export default CloseBtn;
