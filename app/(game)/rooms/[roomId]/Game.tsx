"use client";

import Phaser from "phaser";
import { useEffect } from "react";
import config from "@/app/(game)/rooms/[roomId]/(phaser)/config";

const Game = () => {
  useEffect(() => {
    const game = new Phaser.Game(config);

    return () => {
      game.destroy(true);
    };
  }, []);

  return (
    <div className="w-[calc(100%-300px)] h-full">
      <div id="game-content" />
    </div>
  );
};

export default Game;
