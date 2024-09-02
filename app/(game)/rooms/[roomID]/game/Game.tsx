"use client";

import {
  ChatResponse,
  DORABody,
  DORARequest,
  GameInfo,
  GameOverRequest,
  ImportCardBody,
  ImportRequest,
  ImportSingleCardBody,
  ImportSingleCardRequest,
  UserSocket,
} from "@/utils/socketTypes";
import cards, { CardImage } from "@/app/(game)/rooms/[roomID]/game/cards";
import UserPanel from "@/app/(game)/rooms/[roomID]/game/UserPanel";
import MyCardBoard from "@/app/(game)/rooms/[roomID]/game/MyCardBoard";
import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import ShuffleLeftCards from "@/app/(game)/rooms/[roomID]/game/ShuffleLeftCards";
import CloseBtn from "@/app/(game)/rooms/[roomID]/CloseBtn";
import StartBtn from "@/app/(game)/rooms/[roomID]/StartBtn";
import ReadyBtn from "@/app/(game)/rooms/[roomID]/ReadyBtn";
import cardChapWavSrc from "@/public/audios/card_chap.wav";
import ChatForm from "@/app/(game)/rooms/[roomID]/game/ChatForm";

type GameProps = {
  ws: WebSocket | null;
  roomID: string;
  users: UserSocket[] | null;
  gameInfo: GameInfo | null;
  currentUser: UserSocket;
  isStarted: boolean;
  setWinner: Dispatch<SetStateAction<UserSocket | null>>;
  setIsHelpModal: Dispatch<SetStateAction<boolean>>;
  chatList: ChatResponse[];
};

const Game = ({
  currentUser,
  gameInfo,
  ws,
  roomID,
  isStarted,
  users,
  setWinner,
  setIsHelpModal,
  chatList,
}: GameProps) => {
  const cardChapAudioRef = useRef<HTMLAudioElement>(null);

  const dora = gameInfo?.dora;
  const isUserTurn = gameInfo?.playTurn === currentUser.turnNumber;
  const isUserLoan = gameInfo?.loanInfo?.userID === currentUser.id;

  const [isLoanEnd, setIsLoanEnd] = useState(false);

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

    cardChapAudioRef.current?.play();
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
        cardChapAudioRef.current?.play();
      }
    }
  };

  const onGameOver = () => {
    const req: GameOverRequest = {
      roomID: Number(roomID),
      message: "",
      event: "GAME_OVER",
      userID: currentUser.id,
    };

    ws?.send(JSON.stringify(req));
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

  useEffect(() => {
    setIsLoanEnd(false);
  }, [gameInfo?.playTurn]);

  const userWithoutMe = users?.filter((user) => user.id !== currentUser.id);

  return (
    <>
      <div className="w-full h-[calc(100%-40px)] bg-green-500 flex gap-4 p-8">
        <div className="w-[304px] h-full flex flex-col gap-4">
          {userWithoutMe && (
            <UserPanel
              user={userWithoutMe[0]}
              playTurn={gameInfo?.playTurn}
              isLoanSelectMode={isLoanSelectMode}
              setIsLoanSelectMode={setIsLoanSelectMode}
              ws={ws}
              gameInfo={gameInfo}
              roomID={Number(roomID)}
              setIsLoanEnd={setIsLoanEnd}
              currentUser={currentUser}
              isStarted={isStarted}
              chatList={chatList}
            />
          )}

          {userWithoutMe && (
            <UserPanel
              user={userWithoutMe[1]}
              playTurn={gameInfo?.playTurn}
              isLoanSelectMode={isLoanSelectMode}
              setIsLoanSelectMode={setIsLoanSelectMode}
              ws={ws}
              gameInfo={gameInfo}
              roomID={Number(roomID)}
              setIsLoanEnd={setIsLoanEnd}
              currentUser={currentUser}
              isStarted={isStarted}
              chatList={chatList}
            />
          )}
        </div>

        {isStarted ? (
          <div className="w-[calc(100%-608px-32px)] py-4">
            <div className="h-[60px] font-bold text-white text-3xl justify-center items-center flex gap-2">
              {gameInfo?.loanInfo === null ? (
                <>
                  {!isFullSixCard && isUserTurn && (
                    <p>
                      {currentUser.cards === null
                        ? gameInfo.dora === null
                          ? "도라를 선택해주세요"
                          : "가져올 패 5개를 선택해주세요"
                        : "가져올 패 1개를 선택하거나 론을 클릭하여 원하는 상대의 패를 선택해주세요"}
                    </p>
                  )}
                  {isFullSixCard &&
                    "쯔모를 외치거나 버리기를 클릭해 원하는 카드를 버려주세요"}

                  {!isUserTurn && <p>차례를 기다려주세요</p>}
                </>
              ) : (
                <p>
                  {gameInfo?.loanInfo.userID === currentUser?.id
                    ? `론 승리를 선언하시거나 버리기(포기)해주세요`
                    : `${gameInfo?.loanInfo.userID}님의 론을 선언했습니다`}
                </p>
              )}
            </div>

            <div className="w-full h-[calc(100%-260px)] flex justify-center">
              <ShuffleLeftCards
                leftCards={leftCards}
                isUserTurn={isUserTurn}
                isFullSixCard={isFullSixCard}
                onSelectCard={onSelectCard}
                selectedCards={selectedCards}
                isLoan={!!gameInfo?.loanInfo}
                onGameOver={onGameOver}
                isLoanSelectMode={isLoanSelectMode}
              />
            </div>

            <div className="h-[80px] flex justify-center items-center text-white font-bold">
              {isFullSelectedCards && (
                <button
                  onClick={getCards}
                  disabled={!isFullSelectedCards}
                  className="py-1 px-4 border-2 border-white rounded-full"
                >
                  분배 받기
                </button>
              )}

              {isOneSelectedCard && (
                <button
                  onClick={getCards}
                  disabled={!isOneSelectedCard}
                  className="py-1 px-4 border-2 border-white rounded-full"
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
              isLoanEnd={isLoanEnd}
              setWinner={setWinner}
            />
          </div>
        ) : (
          <div className="w-[calc(100%-608px-32px)] h-full flex justify-center items-center">
            <div className="w-[120px]">
              {currentUser.isOwner ? (
                <StartBtn gameInfo={gameInfo} ws={ws} roomID={roomID} />
              ) : (
                <ReadyBtn ws={ws} roomID={roomID} currentUser={currentUser} />
              )}
            </div>
          </div>
        )}

        <div className="w-[304px] h-full flex flex-col gap-4">
          {userWithoutMe && (
            <UserPanel
              user={userWithoutMe[2]}
              playTurn={gameInfo?.playTurn}
              isLoanSelectMode={isLoanSelectMode}
              setIsLoanSelectMode={setIsLoanSelectMode}
              ws={ws}
              gameInfo={gameInfo}
              roomID={Number(roomID)}
              setIsLoanEnd={setIsLoanEnd}
              currentUser={currentUser}
              isStarted={isStarted}
              place={"right"}
              chatList={chatList}
            />
          )}

          <UserPanel
            user={currentUser}
            playTurn={gameInfo?.playTurn}
            isLoanSelectMode={isLoanSelectMode}
            setIsLoanSelectMode={setIsLoanSelectMode}
            ws={ws}
            gameInfo={gameInfo}
            roomID={Number(roomID)}
            setIsLoanEnd={setIsLoanEnd}
            currentUser={currentUser}
            isStarted={isStarted}
            place={"right"}
            chatList={chatList}
          />
        </div>
      </div>
      <div className="flex h-10 justify-end bg-green-600">
        <div className="w-[calc(100%-400px)] p-1">
          <ChatForm
            ws={ws}
            roomID={roomID}
            currentUser={currentUser}
            gameInfo={gameInfo}
          />
        </div>

        <button
          onClick={() => setIsHelpModal(true)}
          className="w-[200px] bg-green-400 font-bold text-white"
        >
          설명서
        </button>
        <div className="w-[200px]">
          {isStarted ? (
            <div className="flex items-center justify-center w-full h-full bg-gray-400">
              진행중
            </div>
          ) : (
            <CloseBtn ws={ws} roomID={roomID} userID={Number(currentUser.id)} />
          )}
        </div>
      </div>

      <audio src={cardChapWavSrc} hidden ref={cardChapAudioRef} />
    </>
  );
};

export default Game;
