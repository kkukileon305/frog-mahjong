"use client";

import { GameInfo, STARTRequest } from "@/utils/socketTypes";

type StartBtnProps = {
  gameInfo: GameInfo | null;
  ws: WebSocket | null;
  roomID: string;
};

const StartBtn = ({ gameInfo, ws, roomID }: StartBtnProps) => {
  const onClick = () => {
    const request: STARTRequest = {
      roomID: Number(roomID),
      event: "START",
      message: "",
    };

    ws?.send(JSON.stringify(request));
  };

  return (
    <button
      className={`rounded-xl font-bold text-white p-2 w-full bg-blue-400 disabled:bg-gray-400`}
      onClick={onClick}
      disabled={!gameInfo?.allReady}
    >
      {gameInfo?.allReady ? "시작하기" : "시작 불가"}
    </button>
  );
};

export default StartBtn;
