"use client";

type ReadyBtnProps = {
  ws: WebSocket | null;
  roomID: string;
};

const ReadyBtn = ({ ws, roomID }: ReadyBtnProps) => {
  const onClick = () => {};

  return (
    <button onClick={onClick} className="bg-blue-400 text-white p-2 w-full">
      준비
    </button>
  );
};

export default ReadyBtn;
