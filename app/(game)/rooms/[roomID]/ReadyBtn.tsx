"use client";

import {
  READYCANCELRequest,
  READYRequest,
  UserSocket,
} from "@/utils/constants/socketTypes";
import { READY, READY_CANCEL } from "@/utils/constants/const";
import { useTranslations } from "next-intl";

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
  const m = useTranslations("ReadyBtn");

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
      {isReady ? m("cancelReady") : m("ready")}
    </button>
  );
};

export default ReadyBtn;
