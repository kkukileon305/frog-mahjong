"use client";

import {
  DORABody,
  DORARequest,
  GameInfo,
  ImportCardBody,
  UserSocket,
} from "@/utils/socketTypes";
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
  const dora = gameInfo?.dora;
  const isUserTurn = gameInfo?.playTurn === currentUser.turnNumber;

  const getCard = (card: CardImage) => {
    if (isUserTurn) {
      if (dora) {
        // TODO: 패 가져오기 구현 => 카드 ID로 변경, DORA도
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
              playTurn={gameInfo?.playTurn}
            />
          </div>
          <div className="flex justify-center items-center">
            <div>
              <OtherCards
                user={users?.find(
                  (user) =>
                    user.turnNumber === getTurn(currentUser.turnNumber + 3)
                )}
                playTurn={gameInfo?.playTurn}
              />
            </div>
            <div className="w-[700px] h-[400px] border border-black flex">
              <div className="w-[400px] h-full flex flex-wrap items-center justify-center">
                {leftCards.map((card) => (
                  <Card
                    card={card}
                    key={card.id}
                    disabled={!isUserTurn}
                    onClick={() => getCard(card)}
                  />
                ))}
              </div>
              <div className="w-[300px]">
                도라
                {gameInfo?.dora?.cardID}
              </div>
            </div>
            <div>
              <OtherCards
                user={users?.find(
                  (user) =>
                    user.turnNumber === getTurn(currentUser.turnNumber + 1)
                )}
                playTurn={gameInfo?.playTurn}
              />
            </div>
          </div>
          <div className="flex justify-center items-center">
            <MyCards user={currentUser} isUserTurn={isUserTurn} />
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
