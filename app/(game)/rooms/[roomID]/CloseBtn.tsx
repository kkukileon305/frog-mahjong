"use client";

import { CLOSERequest } from "@/utils/socketTypes";
import { useRouter } from "next/navigation";

type CloseBtnProps = {
  ws: WebSocket | null;
  roomID: string;
};

const CloseBtn = ({ ws, roomID }: CloseBtnProps) => {
  const router = useRouter();

  const onClick = () => {
    const closeReq: CLOSERequest = {
      roomID: Number(roomID),
      event: "CLOSE",
      message: "",
    };

    ws?.send(JSON.stringify(closeReq));
    ws?.close();
    router.push("/rooms");
  };

  return (
    <button onClick={onClick} className="bg-red-400 text-white p-2 w-full">
      나가기
    </button>
  );
};

export default CloseBtn;
