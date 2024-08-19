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
import OtherCards from "@/app/(game)/rooms/[roomID]/game/OtherCards";
import MyCardBoard from "@/app/(game)/rooms/[roomID]/game/MyCardBoard";
import Image from "next/image";
import { useState } from "react";
import ShuffleLeftCards from "@/app/(game)/rooms/[roomID]/game/ShuffleLeftCards";

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
  const isUserLoan = gameInfo?.loanInfo?.userID === currentUser.turnNumber;

  const [discardMode, setDiscardMode] = useState(false);

  const [selectedCards, setSelectedCards] = useState<CardImage[]>([]);

  const [isLoanSelectMode, setIsLoanSelectMode] = useState(false);

  const isFullSelectedCards = selectedCards.length === 5;
  const isOneSelectedCard =
    selectedCards.length === 1 && currentUser.cards !== null;
  const isFullSixCard = currentUser?.cards?.length === 6;

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
          <div className="w-full h-[calc(100%-320px)] border border-black flex justify-center">
            <ShuffleLeftCards
              leftCards={leftCards}
              isUserTurn={isUserTurn}
              isFullSixCard={isFullSixCard}
              onSelectCard={onSelectCard}
              selectedCards={selectedCards}
              isLoan={!!gameInfo?.loanInfo}
            />
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
            {gameInfo?.loanInfo === null ? (
              <>
                {!isOneSelectedCard &&
                  !isFullSelectedCards &&
                  !isFullSixCard &&
                  isUserTurn && (
                    <p>
                      {currentUser.cards === null
                        ? gameInfo.dora === null
                          ? "도라를 선택해주세요"
                          : "가져올 패 5개를 선택해주세요"
                        : "가져올 패 1개를 선택해주세요"}
                    </p>
                  )}

                {!isUserTurn && <p>차례를 기다려주세요</p>}
              </>
            ) : (
              <p>
                {gameInfo?.loanInfo.userID === currentUser?.id
                  ? `쯔모(승리)를 선언하시거나 포기해주세요`
                  : `${gameInfo?.loanInfo.userID}님의 론을 선언했습니다`}
              </p>
            )}

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
          </div>

          <MyCardBoard
            currentUser={currentUser}
            isUserTurn={isUserTurn}
            gameInfo={gameInfo}
            roomID={roomID}
            ws={ws}
            discardMode={discardMode}
            setDiscardMode={setDiscardMode}
            totalUsers={users?.length}
            isLoanSelectMode={isLoanSelectMode}
            setIsLoanSelectMode={setIsLoanSelectMode}
            isUserLoan={isUserLoan}
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
                isLoanSelectMode={isLoanSelectMode}
                setIsLoanSelectMode={setIsLoanSelectMode}
                ws={ws}
                gameInfo={gameInfo}
                roomID={Number(roomID)}
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
