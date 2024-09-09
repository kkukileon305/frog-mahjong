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
} from "@/utils/constants/socketTypes";
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
import Timer from "@/app/(game)/rooms/[roomID]/game/Timer";
import {
  DORA,
  GAME_OVER,
  IMPORT_CARDS,
  IMPORT_SINGLE_CARD,
} from "@/utils/constants/const";
import { useTranslations } from "next-intl";

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
  isGetCard: boolean;
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
  isGetCard,
}: GameProps) => {
  const m = useTranslations("Game");

  const audioRef = useRef<HTMLAudioElement>(new Audio(cardChapWavSrc));

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
        event: IMPORT_CARDS,
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
        event: IMPORT_SINGLE_CARD,
        roomID: Number(roomID),
        message: JSON.stringify(body),
      };

      ws?.send(JSON.stringify(request));

      setSelectedCards([]);
    }

    audioRef.current?.play();
  };

  const onSelectCard = (card: CardImage) => {
    if (isUserTurn) {
      if (dora) {
        // 중복검사
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
          event: DORA,
          message: JSON.stringify(requestBody),
        };

        ws?.send(JSON.stringify(request));
        audioRef.current?.play();
      }
    }
  };

  const onGameOver = () => {
    const req: GameOverRequest = {
      roomID: Number(roomID),
      message: "",
      event: GAME_OVER,
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

  const getSystemMessage = () => {
    if (gameInfo?.loanInfo === null) {
      if (!isFullSixCard && isUserTurn) {
        if (currentUser.cards === null) {
          return gameInfo.dora === null ? m("getDora") : m("getFiveCards");
        } else {
          return leftCards.length === 0 ? m("noLeftCards") : m("getCard");
        }
      }

      if (isFullSixCard) {
        return m("goVictory");
      }

      if (!isUserTurn) {
        return m("waitYourTurn");
      }
    } else {
      return gameInfo?.loanInfo.userID === currentUser?.id
        ? m("goLoanVictory")
        : `${users?.find((u) => gameInfo?.loanInfo?.userID === u.id)?.name}${m(
            "someoneLoan"
          )}`;
    }
  };

  return (
    <>
      <div className="w-full h-[calc(100%-40px)] bg-game bg-cover bg-center flex p-8">
        <div className="basis-1/5 h-full flex flex-col gap-4">
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
          <div className="basis-3/5 py-4 relative z-20">
            <div className="w-full h-[calc(100%-300px)] flex justify-center">
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
                  {m("getSelectedCard")}
                </button>
              )}

              {isOneSelectedCard && (
                <button
                  onClick={getCards}
                  disabled={!isOneSelectedCard}
                  className="py-1 px-4 border-2 border-white rounded-full"
                >
                  {m("getSelectedCard")}
                </button>
              )}
            </div>

            <div className="h-[100px] font-bold text-white text-2xl text-center justify-center items-center flex gap-2 flex-col">
              <p>{getSystemMessage()}</p>

              {gameInfo?.timer && (
                <Timer
                  ws={ws}
                  gameInfo={gameInfo}
                  users={users}
                  leftCards={leftCards}
                  setSelectedCards={setSelectedCards}
                />
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
              selectedCards={selectedCards}
              isGetCard={isGetCard}
            />
          </div>
        ) : (
          <div className="basis-3/5 h-full flex justify-center items-center relative z-20">
            <div className="w-[120px]">
              {currentUser.isOwner ? (
                <StartBtn gameInfo={gameInfo} ws={ws} roomID={roomID} />
              ) : (
                <ReadyBtn ws={ws} roomID={roomID} currentUser={currentUser} />
              )}
            </div>
          </div>
        )}

        <div className="basis-1/5 h-full flex flex-col gap-4">
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
        <div className="basis-1/4" />

        <div className="basis-1/2 p-1">
          <ChatForm
            ws={ws}
            roomID={roomID}
            currentUser={currentUser}
            gameInfo={gameInfo}
          />
        </div>

        <div className="flex basis-1/4">
          <button
            onClick={() => setIsHelpModal(true)}
            className="basis-1/2 bg-green-400 font-bold text-white"
          >
            {m("help")}
          </button>
          <div className="basis-1/2">
            {isStarted ? (
              <div className="flex items-center justify-center w-full h-full bg-gray-400">
                {m("playing")}
              </div>
            ) : (
              <CloseBtn
                ws={ws}
                roomID={roomID}
                userID={Number(currentUser.id)}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Game;
