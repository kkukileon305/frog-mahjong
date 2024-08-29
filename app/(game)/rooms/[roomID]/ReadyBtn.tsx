"use client";

import {
  READYCANCELRequest,
  READYRequest,
  UserSocket,
} from "@/utils/socketTypes";
import { READY, READY_CANCEL } from "@/utils/const";

type ReadyBtnProps = {
  ws: WebSocket | null;
  roomID: string;
  currentUser: UserSocket;
};

const ReadyBtn = ({
  ws,
  roomID,
  currentUser: { playerState },
}: ReadyBtnProps) => {
  const isReady = playerState === "ready";

  const onClick = () => {
    const request: READYRequest | READYCANCELRequest = {
      roomID: Number(roomID),
      event: isReady ? READY_CANCEL : READY,
      message: "",
    };

    ws?.send(JSON.stringify(request));
  };

  return (
    <button
      onClick={onClick}
      className={`rounded-xl font-bold text-white p-2 w-full ${
        isReady ? "bg-red-400" : "bg-blue-400"
      }`}
    >
      {isReady ? "준비 취소" : "준비"}
    </button>
  );
};

export default ReadyBtn;
