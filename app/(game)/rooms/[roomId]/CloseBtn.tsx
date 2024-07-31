"use client";

import { CLOSERequest } from "@/utils/socketTypes";
import { useRouter } from "next/navigation";

type CloseBtnProps = {
  ws: WebSocket | null;
  roomId: string;
};

const CloseBtn = ({ ws, roomId }: CloseBtnProps) => {
  const router = useRouter();

  const onClick = () => {
    const closeReq: CLOSERequest = {
      roomID: Number(roomId),
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
