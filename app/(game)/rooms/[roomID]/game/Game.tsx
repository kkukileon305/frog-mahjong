"use client";

import { GameInfo, UserSocket } from "@/utils/socketTypes";
import StartBtn from "@/app/(game)/rooms/[roomID]/game/StartBtn";

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
    return <div>게임 시작!</div>;
  }

  return (
    <div className="w-full h-full p-2">
      <div className="w-full h-full flex justify-center items-center bg-gray-400">
        {currentUser.isOwner ? (
          <StartBtn gameInfo={gameInfo} ws={ws} roomID={roomID} />
        ) : (
          <p>방장의 시작을 기다리는 중</p>
        )}
      </div>
    </div>
  );
};

export default Game;
