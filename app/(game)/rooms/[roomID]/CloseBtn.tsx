"use client";

import { QUITRequest } from "@/utils/socketTypes";
import { useRouter } from "next/navigation";
import { QUIT_GAME } from "@/utils/const";

type CloseBtnProps = {
  ws: WebSocket | null;
  roomID: string;
  userID: number;
};

const CloseBtn = ({ ws, roomID, userID }: CloseBtnProps) => {
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
      나가기
    </button>
  );
};

export default CloseBtn;
