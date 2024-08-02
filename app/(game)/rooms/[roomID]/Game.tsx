"use client";

type GameProps = {
  ws: WebSocket | null;
  roomID: string;
};

const Game = ({}: GameProps) => {
  return (
    <div className="w-full h-full p-2">
      <div className="w-full h-full flex justify-center items-center bg-gray-400">
        GAME
      </div>
    </div>
  );
};

export default Game;
