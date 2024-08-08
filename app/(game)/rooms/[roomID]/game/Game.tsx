"use client";

import {
  DORABody,
  DORARequest,
  GameInfo,
  UserSocket,
} from "@/utils/socketTypes";
import StartBtn from "@/app/(game)/rooms/[roomID]/StartBtn";
import cards, { CardImage } from "@/app/(game)/rooms/[roomID]/game/cards";
import Card from "@/app/(game)/rooms/[roomID]/game/Card";

type GameProps = {
  ws: WebSocket | null;
  roomID: string;
  users: UserSocket[] | null;
  gameInfo: GameInfo | null;
  currentUser: UserSocket;
  isStarted: boolean;
};

const Game = ({ currentUser, gameInfo, ws, roomID, isStarted }: GameProps) => {
  const isUserTurn = gameInfo?.playTurn === currentUser.turnNumber;

  const selectDora = (card: CardImage) => {
    if (isUserTurn) {
      const requestBody: DORABody = {
        cards: [
          {
            color: card.color,
            name: card.name,
            state: "dora",
          },
        ],
      };

      const request: DORARequest = {
        userID: currentUser.id,
        roomID: Number(roomID),
        event: "DORA",
        message: JSON.stringify(requestBody),
      };

      ws?.send(JSON.stringify(request));
    }
  };

  if (isStarted) {
    return (
      <div className="w-full h-full p-2">
        <div className="w-full h-full">
          <div className="h-[200px] border border-black"></div>
          <div className="h-[300px] border border-black flex justify-center">
            <div className="h-full w-[300px] border border-black"></div>
            <div className="w-full flex">
              <div className="w-full flex flex-wrap items-center justify-center">
                {cards.map((card) => (
                  <Card
                    card={card}
                    key={card.id}
                    disabled={!isUserTurn}
                    onClick={() => selectDora(card)}
                  />
                ))}
              </div>
              <div className="w-[300px] border border-black">도라</div>
            </div>
            <div className="h-full w-[300px] border border-black"></div>
          </div>
          <div className="h-[200px] border border-black">
            current User
            {isUserTurn ? "패를 선택해주세요" : "당신의 차례가 아닙니다"}
          </div>
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
