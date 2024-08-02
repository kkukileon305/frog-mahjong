"use client";

import { GameInfo, UserSocket } from "@/utils/socketTypes";
import StartBtn from "@/app/(game)/rooms/[roomID]/game/StartBtn";

type GameProps = {
  ws: WebSocket | null;
  roomID: string;
  users: UserSocket[] | null;
  gameInfo: GameInfo | null;
  currentUser: UserSocket;
};

const Game = ({ currentUser, gameInfo, ws, roomID }: GameProps) => {
  return (
    <div className="w-full h-full p-2">
      <div className="w-full h-full flex justify-center items-center bg-gray-400">
        {currentUser.isOwner && (
          <StartBtn gameInfo={gameInfo} ws={ws} roomID={roomID} />
        )}
      </div>
    </div>
  );
};

export default Game;
