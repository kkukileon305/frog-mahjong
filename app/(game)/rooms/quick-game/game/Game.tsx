"use client";

import {
  DORABody,
  DORARequest,
  GameOverRequest,
  ImportCardBody,
  ImportRequest,
  ImportSingleCardBody,
  ImportSingleCardRequest,
} from "@/utils/constants/old-frog-mahjong/socketTypes";
import { CardImage } from "@/app/(game)/rooms/quick-game/game/cards";
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
import useOldFrogMahjongStore from "@/utils/stores/old-frog-mahjong/useOldFrogMahjongStore";
import useSoundStore from "@/utils/stores/useSoundStore";
import axiosInstance, { CardListResponse } from "@/utils/axios";
import { default as cardDataList } from "@/app/(game)/rooms/quick-game/game/cards";
import useMatchSettingStore from "@/utils/stores/useMatchSettingStore";
import { encryptAES } from "@/utils/functions/aes";
import QuestGreen from "@/public/icons/quest_green.png";
import SettingGreen from "@/public/icons/setting_green.png";

type GameProps = {
  setIsHelpModal: Dispatch<SetStateAction<boolean>>;
};

const Game = ({ setIsHelpModal }: GameProps) => {
  const m = useTranslations("Game");
  const { isStarted, ws, gameState, setIsSettingModalOpen } =
    useOldFrogMahjongStore();
  const mode = useMatchSettingStore((s) => s.mode);
  const [cards, setCards] = useState<CardImage[]>([]);

  const accessToken = getCookie("accessToken") as string;

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
  const isGetActive = isFullSelectedCards || isOneSelectedCard;

  const isFullSixCard = currentUser?.cards?.length === 6;

  useEffect(() => {
    const getCards = async () => {
      const roomID = gameInfo?.roomID!;

      const {
        data: { cardIDList },
      } = await axiosInstance.get<CardListResponse>(
        `/v0.1/game/${roomID}/deck`,
        {
          headers: {
            tkn: accessToken,
          },
        }
      );

      const newCards = cardIDList.map(
        (cardID) => cardDataList.find((ci) => ci.id === cardID)!
      );
      setCards(newCards);
    };

    getCards();

    if (mode) {
      localStorage.setItem("matchMode", mode);
    }
  }, []);

  const getSelectedCards = async () => {
    if (isFullSelectedCards && gameInfo?.playTurn) {
      const body: ImportCardBody = {
        cards: selectedCards.map((ic) => ({
          cardID: ic.id,
        })),
        playTurn: gameInfo.playTurn as number,
      };

      const encryptedMessage = await encryptAES(
        JSON.stringify(body),
        btoa(process.env.NEXT_PUBLIC_AES_KEY as string)
      );

      const request: ImportRequest = {
        userID: currentUser?.id,
        event: IMPORT_CARDS,
        roomID: Number(roomID),
        message: encryptedMessage,
      };

      ws?.send(JSON.stringify(request));

      setSelectedCards([]);
    }

    if (isOneSelectedCard && gameInfo?.playTurn) {
      const body: ImportSingleCardBody = {
        cardID: selectedCards[0].id,
        playTurn: gameInfo.playTurn as number,
      };

      const encryptedMessage = await encryptAES(
        JSON.stringify(body),
        btoa(process.env.NEXT_PUBLIC_AES_KEY as string)
      );

      const request: ImportSingleCardRequest = {
        userID: currentUser?.id,
        event: IMPORT_SINGLE_CARD,
        roomID: Number(roomID),
        message: encryptedMessage,
      };

      ws?.send(JSON.stringify(request));

      setSelectedCards([]);
    }

    audios?.cardChapAudio.play();
  };

  const onSelectCard = async (card: CardImage) => {
    if (isUserTurn) {
      if (dora?.cardID) {
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

        const encryptedMessage = await encryptAES(
          JSON.stringify(requestBody),
          btoa(process.env.NEXT_PUBLIC_AES_KEY as string)
        );

        const request: DORARequest = {
          userID: currentUser.id,
          roomID: Number(roomID),
          event: DORA,
          message: encryptedMessage,
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

  const cardWithoutDora = cards.map((card) =>
    gameInfo?.dora?.cardID === card.id ? { ...card, isValid: false } : card
  );

  const allUserCardIds = users
    ?.map((user) => (user.cards ? user.cards.map((card) => card.cardID) : []))
    .flat();

  const allUserDiscardedIds = users
    ?.map((user) =>
      user.discardedCards ? user.discardedCards.map((card) => card.cardID) : []
    )
    .flat();

  // 전체 cards에서 valid 값만 반영
  const leftCards = cardWithoutDora.map((card) =>
    allUserCardIds?.includes(card.id) || allUserDiscardedIds?.includes(card.id)
      ? { ...card, isValid: false }
      : card
  );

  // valid filter
  const filteredCards = leftCards.filter((card) => card.isValid);

  useEffect(() => {
    setIsLoanEnd(false);
  }, [gameInfo?.playTurn]);

  const userWithoutMe = users?.filter((user) => user.id !== currentUser.id);

  const getSystemMessage = () => {
    if (gameInfo?.loanInfo === null) {
      if (!isFullSixCard && isUserTurn) {
        if (currentUser.cards === null) {
          return gameInfo.dora ? m("getFiveCards") : m("getDora");
        } else {
          return filteredCards.length === 0 ? m("noLeftCards") : m("getCard");
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
      <div className="relative w-full h-[calc(100%-32px)] lg:h-[calc(100%-40px)] bg-game bg-cover bg-center flex gap-2 p-2 lg:p-8">
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
          <div className="basis-3/5 lg:py-4 py-2 relative z-10">
            <div className="w-full h-[calc(100%-100px)] lg:h-[calc(100%-220px)] flex justify-center mb-2">
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

            <div className="h-[40px] lg:h-[100px] overflow-hidden font-bold text-white text-xs lg:text-2xl text-center justify-center items-center flex lg:gap-2 flex-col">
              <p>{getSystemMessage()}</p>

              {gameInfo?.timer && (
                <Timer
                  filteredCards={filteredCards}
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
              getSelectedCards={getSelectedCards}
              isGetActive={isGetActive}
            />
          </div>
        ) : (
          <div className="basis-3/5 h-full flex justify-center items-center relative z-10">
            <div className="w-[120px]">
              {cards.length === 0 ? <p>cards Loading</p> : <ReadyStartText />}
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

        <div className="flex basis-1/5 pl-8">
          <button
            onClick={() => setIsHelpModal(true)}
            className="text-xs lg:text-base w-full font-bold flex justify-center items-center p-1"
          >
            <img className="h-full" src={QuestGreen.src} alt="help" />
          </button>

          <button
            onClick={() => setIsSettingModalOpen(true)}
            className="text-xs lg:text-base w-full font-bold flex justify-center items-center p-1"
          >
            <img className="h-full" src={SettingGreen.src} alt="setting" />
          </button>
        </div>
      </div>
    </>
  );
};

export default Game;
