"use client";

type ReadyBtnProps = {
  ws: WebSocket | null;
  roomID: string;
};

const ReadyBtn = ({ ws, roomID }: ReadyBtnProps) => {
  return <button></button>;
};

export default ReadyBtn;
