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
      className="bg-white p-2 rounded-xl font-bold"
      disabled={!gameInfo?.allReady}
      onClick={onClick}
    >
      {gameInfo?.allReady ? "시작하기" : "시작 불가능"}
    </button>
  );
};

export default StartBtn;
