"use client";

import {
  DORABody,
  DORARequest,
  GameOverRequest,
  ImportCardBody,
  ImportRequest,
  ImportSingleCardBody,
  ImportSingleCardRequest,
} from "@/utils/constants/socketTypes";
import cards, { CardImage } from "@/app/(game)/rooms/quick-game/game/cards";
import UserPanel from "@/app/(game)/rooms/quick-game/game/UserPanel";
import MyCardBoard from "@/app/(game)/rooms/quick-game/game/MyCardBoard";
import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import ShuffleLeftCards from "@/app/(game)/rooms/quick-game/game/ShuffleLeftCards";
import ChatForm from "@/app/(game)/rooms/quick-game/game/ChatForm";
import Timer from "@/app/(game)/rooms/quick-game/game/Timer";
import {
  DORA,
  GAME_OVER,
  IMPORT_CARDS,
  IMPORT_SINGLE_CARD,
} from "@/utils/constants/const";
import { useTranslations } from "next-intl";
import ReadyStartText from "@/app/(game)/rooms/quick-game/ReadyStartText";
import { getCookie } from "cookies-next";
import useGameStore from "@/utils/stores/useGameStore";
import useSoundStore from "@/utils/stores/useSoundStore";
import Image from "next/image";
import bg from "@/public/bg/game_background.jpg";

type GameProps = {
  setIsHelpModal: Dispatch<SetStateAction<boolean>>;
};

const Game = ({ setIsHelpModal }: GameProps) => {
  const m = useTranslations("Game");
  const { isStarted, ws, gameState } = useGameStore();

  const gameInfo = gameState?.gameInfo;
  const roomID = gameInfo?.roomID;
  const users = gameState?.users;

  const userID = getCookie("userID") as string;
  const currentUser = users?.find((user) => user.id === Number(userID))!;

  const audios = useSoundStore((s) => s.audios);

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

    audios?.cardChapAudio.play();
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
        audios?.cardChapAudio.play();
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
      <div className="relative w-full h-[calc(100%-32px)] lg:h-[calc(100%-40px)] bg-cover bg-center flex gap-2 p-2 lg:p-8">
        <Image
          src={bg}
          alt="bg"
          fill
          style={{
            objectFit: "cover",
          }}
        />

        <div className="basis-1/5 h-full flex flex-col gap-4">
          {userWithoutMe && (
            <UserPanel
              user={userWithoutMe[0]}
              isLoanSelectMode={isLoanSelectMode}
              setIsLoanSelectMode={setIsLoanSelectMode}
              setIsLoanEnd={setIsLoanEnd}
            />
          )}

          {userWithoutMe && (
            <UserPanel
              user={userWithoutMe[1]}
              isLoanSelectMode={isLoanSelectMode}
              setIsLoanSelectMode={setIsLoanSelectMode}
              setIsLoanEnd={setIsLoanEnd}
            />
          )}
        </div>

        {isStarted ? (
          <div className="basis-3/5 lg:py-4 py-2 relative z-20">
            <div className="w-full h-[calc(100%-128px)] lg:h-[calc(100%-300px)] flex justify-center mb-2">
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

            <div className="h-[28px] lg:h-[80px] text-xs lg:text-base flex justify-center items-center text-white font-bold">
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

            <div className="h-[40px] lg:h-[100px] overflow-hidden font-bold text-white text-xs lg:text-2xl text-center justify-center items-center flex lg:gap-2 flex-col">
              <p>{getSystemMessage()}</p>

              {gameInfo?.timer && (
                <Timer
                  leftCards={leftCards}
                  setSelectedCards={setSelectedCards}
                />
              )}
            </div>

            <MyCardBoard
              discardMode={discardMode}
              setDiscardMode={setDiscardMode}
              isLoanSelectMode={isLoanSelectMode}
              setIsLoanSelectMode={setIsLoanSelectMode}
              isUserLoan={isUserLoan}
              isLoanEnd={isLoanEnd}
              selectedCards={selectedCards}
            />
          </div>
        ) : (
          <div className="basis-3/5 h-full flex justify-center items-center relative z-20">
            <div className="w-[120px]">
              <ReadyStartText />
            </div>
          </div>
        )}

        <div className="basis-1/5 h-full flex flex-col gap-4">
          {userWithoutMe && (
            <UserPanel
              user={userWithoutMe[2]}
              isLoanSelectMode={isLoanSelectMode}
              setIsLoanSelectMode={setIsLoanSelectMode}
              setIsLoanEnd={setIsLoanEnd}
              place="right"
            />
          )}

          <UserPanel
            user={currentUser}
            isLoanSelectMode={isLoanSelectMode}
            setIsLoanSelectMode={setIsLoanSelectMode}
            setIsLoanEnd={setIsLoanEnd}
            place="right"
          />
        </div>
      </div>
      <div className="flex h-8 lg:h-10 justify-end bg-game-bar">
        <div className="basis-1/5" />

        <div className="basis-3/5 p-1">
          <ChatForm />
        </div>

        <div className="flex basis-1/5">
          <button
            onClick={() => setIsHelpModal(true)}
            className="text-xs lg:text-base w-full bg-game-button font-bold"
          >
            {m("help")}
          </button>
        </div>
      </div>
    </>
  );
};

export default Game;
