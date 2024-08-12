"use client";

import {
  DORABody,
  DORARequest,
  GameInfo,
  ImportCardBody,
  ImportRequest,
  ImportSingleCardBody,
  ImportSingleCardRequest,
  UserSocket,
} from "@/utils/socketTypes";
import cards, { CardImage } from "@/app/(game)/rooms/[roomID]/game/cards";
import Card from "@/app/(game)/rooms/[roomID]/game/Card";
import { getTurn } from "@/utils/etc";
import OtherCards from "@/app/(game)/rooms/[roomID]/game/OtherCards";
import MyCards from "@/app/(game)/rooms/[roomID]/game/MyCards";
import Image from "next/image";
import { useState } from "react";

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

  const [random, setRandom] = useState(Math.random);
  const [selectedCards, setSelectedCards] = useState<CardImage[]>([]);

  const isFullSelectedCards = selectedCards.length === 5;
  const isOneSelectedCard =
    selectedCards.length === 1 && currentUser.cards !== null;
  const isFullSixCard =
    currentUser.cards !== null && currentUser.cards.length === 6;

  const getCards = () => {
    if (isFullSelectedCards && gameInfo?.playTurn) {
      const body: ImportCardBody = {
        cards: selectedCards.map((ic) => ({
          cardID: ic.id,
        })),
        playTurn: gameInfo.playTurn as number,
      };

      const request: ImportRequest = {
        userID: currentUser?.id,
        event: "IMPORT_CARDS",
        roomID: Number(roomID),
        message: JSON.stringify(body),
      };

      ws?.send(JSON.stringify(request));

      setSelectedCards([]);
    }

    if (isOneSelectedCard && gameInfo?.playTurn) {
      const body: ImportSingleCardBody = {
        cardID: selectedCards[0].id,
        playTurn: gameInfo.playTurn as number,
      };

      const request: ImportSingleCardRequest = {
        userID: currentUser?.id,
        event: "IMPORT_SINGLE_CARD",
        roomID: Number(roomID),
        message: JSON.stringify(body),
      };

      ws?.send(JSON.stringify(request));

      setSelectedCards([]);
    }
  };

  const onSelectCard = (card: CardImage) => {
    if (isUserTurn) {
      if (dora) {
        //  중복검사
        if (selectedCards.find((sc) => sc.id === card.id)) {
          setSelectedCards(selectedCards.filter((sc) => sc.id !== card.id));
          return;
        }

        if (currentUser.cards === null) {
          // 5개 뽑기 차례 selected에 추가
          if (selectedCards.length < 5) {
            setSelectedCards([...selectedCards, card]);
          }
        } else {
          //  1개씩 뽑는 차례 selected에 추가
          setSelectedCards([card]);
        }
      } else {
        // set dora
        const requestBody: DORABody = {
          cardID: card.id,
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

  const doraImage = cards.find((ci) => ci.id === gameInfo?.dora?.cardID);

  if (isStarted) {
    return (
      <div className="w-full h-full bg-green-500 flex">
        <div className="w-[calc(100%-400px)] h-full">
          <div className="w-full h-[calc(100%-220px)] border border-black flex justify-center">
            <div className="w-[400px] h-full grid grid-cols-10 gap-1 p-4">
              {leftCards
                .sort(() => random - 0.5)
                .map((card) => (
                  <div
                    key={card.id}
                    className="flex justify-center items-center"
                  >
                    <Card
                      card={card}
                      disabled={!isUserTurn || isFullSixCard}
                      onClick={() => onSelectCard(card)}
                      isSelected={selectedCards.includes(card)}
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

          <div className="h-[60px] justify-center items-center border-r border-black flex gap-2">
            {!isOneSelectedCard &&
              !isFullSelectedCards &&
              !isFullSixCard &&
              isUserTurn && (
                <p>
                  {currentUser.cards === null
                    ? "분배받을 5개의 패를 선택해주세요"
                    : "가져올 패 1개를 선택해주세요"}
                </p>
              )}

            {!isUserTurn && <p>차례를 기다려주세요</p>}

            {isFullSelectedCards && (
              <button
                onClick={getCards}
                disabled={!isFullSelectedCards}
                className="bg-white p-1 border border-black rounded-full"
              >
                분배 받기
              </button>
            )}

            {isOneSelectedCard && (
              <button
                onClick={getCards}
                disabled={!isOneSelectedCard}
                className="bg-white p-1 border border-black rounded-full"
              >
                패 가져오기
              </button>
            )}

            {isFullSixCard && (
              <p>버릴 카드를 골라주시거나 쯔모버튼을 눌러주세요</p>
            )}
          </div>

          <MyCards
            currentUser={currentUser}
            isUserTurn={isUserTurn}
            gameInfo={gameInfo}
            roomID={roomID}
            ws={ws}
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