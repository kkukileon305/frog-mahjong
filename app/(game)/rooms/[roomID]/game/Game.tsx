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
import { getTurn } from "@/utils/etc";
import OtherCards from "@/app/(game)/rooms/[roomID]/game/OtherCards";
import MyCards from "@/app/(game)/rooms/[roomID]/game/MyCards";

type GameProps = {
  ws: WebSocket | null;
  roomID: string;
  users: UserSocket[] | null;
  gameInfo: GameInfo | null;
  currentUser: UserSocket;
  isStarted: boolean;
};

const Game = ({
  currentUser,
  gameInfo,
  ws,
  roomID,
  isStarted,
  users,
}: GameProps) => {
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
        <div className="w-full h-full relative">
          <div className="flex justify-center items-center">
            <OtherCards
              user={users?.find(
                (user) =>
                  user.turnNumber === getTurn(currentUser.turnNumber + 2)
              )}
            />
          </div>
          <div className="flex justify-center items-center">
            <div>
              <OtherCards
                user={users?.find(
                  (user) =>
                    user.turnNumber === getTurn(currentUser.turnNumber + 3)
                )}
              />
            </div>
            <div className="w-[700px] h-[400px] border border-black flex">
              <div className="w-[400px] h-full flex flex-wrap items-center justify-center">
                {cards.map((card) => (
                  <Card
                    card={card}
                    key={card.id}
                    disabled={!isUserTurn}
                    onClick={() => selectDora(card)}
                  />
                ))}
              </div>
              <div className="w-[300px]">
                도라
                {gameInfo?.dora?.color}
              </div>
            </div>
            <div>
              <OtherCards
                user={users?.find(
                  (user) =>
                    user.turnNumber === getTurn(currentUser.turnNumber + 1)
                )}
              />
            </div>
          </div>
          <div className="flex justify-center items-center">
            <MyCards user={users?.find((user) => currentUser.id == user.id)} />
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
