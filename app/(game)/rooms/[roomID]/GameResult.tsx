"use client";

import { GameInfo } from "@/utils/socketTypes";

type GameResultProps = {
  gameInfo: GameInfo | null;
};

const GameResult = ({ gameInfo }: GameResultProps) => {
  return (
    <div className="flex justify-center items-center h-[calc(100vh-64px)]">
      <div className="max-w-3xl w-full mx-auto h-[400px]">asd</div>
    </div>
  );
};

export default GameResult;
