"use client";

import { GameInfo, UserSocket } from "@/utils/socketTypes";
import StartBtn from "@/app/(game)/rooms/[roomID]/StartBtn";

type GameProps = {
  ws: WebSocket | null;
  roomID: string;
  users: UserSocket[] | null;
  gameInfo: GameInfo | null;
  currentUser: UserSocket;
  isStarted: boolean;
};

const Game = ({ currentUser, gameInfo, ws, roomID, isStarted }: GameProps) => {
  if (isStarted) {
    return (
      <div className="w-full h-full p-2">
        <div className="w-full h-full flex justify-center items-center bg-gray-400">
          시작!
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full p-2">
      <div className="w-full h-full flex justify-center items-center bg-gray-400">
        시작 대기중
      </div>
    </div>
  );
};

export default Game;
