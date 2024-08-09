"use client";

import {
  DORABody,
  DORARequest,
  GameInfo,
  ImportCardBody,
  ImportRequest,
  UserSocket,
} from "@/utils/socketTypes";
import cards, { CardImage } from "@/app/(game)/rooms/[roomID]/game/cards";
import Card from "@/app/(game)/rooms/[roomID]/game/Card";
import { getTurn } from "@/utils/etc";
import OtherCards from "@/app/(game)/rooms/[roomID]/game/OtherCards";
import MyCards from "@/app/(game)/rooms/[roomID]/game/MyCards";
import Image from "next/image";

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
  const dora = gameInfo?.dora;
  const isUserTurn = gameInfo?.playTurn === currentUser.turnNumber;

  const getCard = (card: CardImage) => {
    if (isUserTurn) {
      if (dora) {
        const requestBody: ImportCardBody = {
          cards: [
            {
              cardID: card.id,
            },
          ],
          playTurn: gameInfo?.playTurn,
        };

        const request: ImportRequest = {
          roomID: Number(roomID),
          event: "IMPORT_CARDS",
          userID: currentUser.id,
          message: JSON.stringify(requestBody),
        };

        ws?.send(JSON.stringify(request));
      } else {
        const requestBody: DORABody = {
          cards: [
            {
              cardID: card.id,
            },
          ],
          playTurn: gameInfo.playTurn,
        };

        const request: DORARequest = {
          userID: currentUser.id,
          roomID: Number(roomID),
          event: "DORA",
          message: JSON.stringify(requestBody),
        };

        ws?.send(JSON.stringify(request));
      }
    }
  };

  const cardWithoutDora = cards.filter(
    (card) => gameInfo?.dora?.cardID !== card.id
  );

  const allUserCardIds = users
    ?.map((user) => (user.cards ? user.cards.map((card) => card.cardID) : []))
    .flat();

  const allUserDiscardedIds = users
    ?.map((user) =>
      user.discardedCards ? user.discardedCards.map((card) => card.cardID) : []
    )
    .flat();

  const leftCards = cardWithoutDora.filter(
    (card) =>
      !(
        allUserCardIds?.includes(card.id) ||
        allUserDiscardedIds?.includes(card.id)
      )
  );

  const nextUser = users?.find(
    (user) =>
      user.turnNumber === getTurn(currentUser.turnNumber + 1, users?.length)
  );

  const doraImage = cards.find((ci) => ci.id === gameInfo?.dora?.cardID);

  if (isStarted) {
    return (
      <div className="w-full h-full bg-green-500 flex">
        <div className="w-[calc(100%-400px)] h-full">
          <div className="w-full h-[calc(100%-160px)] border border-black flex justify-center">
            <div className="w-[400px] h-full grid grid-cols-10 gap-1 p-4">
              {leftCards
                .sort(() => Math.random() - 0.5)
                .map((card) => (
                  <div
                    key={card.id}
                    className="flex justify-center items-center"
                  >
                    <Card
                      card={card}
                      disabled={!isUserTurn}
                      onClick={() => getCard(card)}
                    />
                  </div>
                ))}
            </div>
            <div className="w-[300px] flex justify-center items-center">
              {doraImage && (
                <Image
                  src={doraImage.imageSrc}
                  alt={doraImage.color + doraImage.name}
                  width={40}
                  height={58}
                />
              )}
            </div>
          </div>

          <MyCards
            currentUser={currentUser}
            isUserTurn={isUserTurn}
            gameInfo={gameInfo}
          />
        </div>
        <div className="w-[400px] h-[calc(100vh-224px)] overflow-y-auto">
          {users
            ?.filter((user) => user.id !== currentUser.id)
            .map((user) => (
              <OtherCards
                key={user.id}
                user={user}
                playTurn={gameInfo?.playTurn}
              />
            ))}
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
