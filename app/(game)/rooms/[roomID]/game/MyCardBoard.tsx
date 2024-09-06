"use client";

import {
  DiscardBody,
  DiscardRequest,
  GameInfo,
  LoanFailedBody,
  LoanFailedRequest,
  LoanSuccessBody,
  LoanSuccessRequest,
  UserSocket,
  WinRequest,
  WinRequestBody,
} from "@/utils/socketTypes";
import cards, { CardImage } from "@/app/(game)/rooms/[roomID]/game/cards";
import Image from "next/image";
import MyCardList from "@/app/(game)/rooms/[roomID]/game/MyCardList";
import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import axiosInstance, { ScoreResult } from "@/utils/axios";
import { getCookie } from "cookies-next";
import getPrevTurn from "@/utils/getPrevTurn";
import cardChapWavSrc from "@/public/audios/card_chap.wav";
import { DISCARD, FAILED_LOAN, REQUEST_WIN, SUCCESS_LOAN } from "@/utils/const";
import { useTranslations } from "next-intl";

type MyCardProps = {
  currentUser?: UserSocket;
  isUserTurn: boolean;
  gameInfo: GameInfo | null;
  roomID: string;
  ws: null | WebSocket;
  discardMode: boolean;
  setDiscardMode: Dispatch<SetStateAction<boolean>>;
  totalUsers?: number;
  isLoanSelectMode: boolean;
  setIsLoanSelectMode: Dispatch<SetStateAction<boolean>>;
  isUserLoan: boolean;
  isLoanEnd: boolean;
  setWinner: Dispatch<SetStateAction<UserSocket | null>>;
};

const MyCardBoard = ({
  currentUser,
  gameInfo,
  roomID,
  ws,
  discardMode,
  setDiscardMode,
  totalUsers,
  isLoanSelectMode,
  setIsLoanSelectMode,
  isUserLoan,
  isLoanEnd,
}: MyCardProps) => {
  const m = useTranslations("MyCardBoard");

  const audioRef = useRef<HTMLAudioElement>(new Audio(cardChapWavSrc));

  // 패 조합 점수
  const [scoreResult, setScoreResult] = useState<ScoreResult>({
    score: 0,
    bonuses: [],
  });

  const userCardImages = currentUser?.cards?.map(
    (card) =>
      cards.find((cardImage) => cardImage.id === card.cardID) as CardImage
  );

  // 유저의 배열상태 저장
  const [items, setItems] = useState<CardImage[]>(userCardImages || []);

  const isFullSixCard = currentUser?.cards?.length === 6;

  const calScore = async (values: CardImage[]) => {
    if (values.length === 6) {
      try {
        const { data } = await axiosInstance.post<ScoreResult>(
          "/v0.1/game/score/calculate",
          {
            cards: values.map((ci) => ({ cardID: ci.id })),
            roomID: Number(roomID),
          },
          {
            headers: {
              tkn: getCookie("accessToken"),
            },
          }
        );

        setScoreResult(data);
      } catch (e) {
        console.log(e);
        setScoreResult({
          score: 0,
          bonuses: [],
        });
      }
    }
  };

  useEffect(() => {
    const newItems = userCardImages?.sort((ci) => ci.id) || [];
    const oldItems = items?.sort((ci) => ci.id) || [];

    // 길이가 같다면 같은 패로 간주
    if (newItems.length !== oldItems.length) {
      if (newItems.length > oldItems.length) {
        // 추가 된 경우
        const newItem = newItems.find(
          (nic) => !oldItems.find((oic) => oic.id === nic.id)
        )!!;

        const newList = [...items, newItem];
        calScore(newList);
        setItems(newList);
      } else {
        // 빠진 경우
        const removedItem = oldItems.find(
          (oic) => !newItems.find((nic) => oic.id === nic.id)
        )!!;

        setItems(items.filter((item) => item.id !== removedItem.id));
        setDiscardMode(false);
        setScoreResult({
          score: 0,
          bonuses: [],
        });
      }
    }
  }, [userCardImages]);

  const handleDiscard = (ci: CardImage) => {
    if (isFullSixCard) {
      const body: DiscardBody = {
        cardID: ci.id,
        playTurn: gameInfo?.playTurn as number,
      };

      const request: DiscardRequest = {
        userID: currentUser?.id,
        event: DISCARD,
        roomID: Number(roomID),
        message: JSON.stringify(body),
      };

      ws?.send(JSON.stringify(request));
      setDiscardMode(false);
      setScoreResult({
        score: 0,
        bonuses: [],
      });

      audioRef.current?.play();
    }
  };

  const handleWin = () => {
    if (isFullSixCard && scoreResult.score >= 5) {
      if (isUserLoan) {
        const body: LoanSuccessBody = {
          cards: items.map((card) => ({ cardID: card.id })),
          playTurn: gameInfo?.playTurn as number,
          score: scoreResult.score,
          loanInfo: {
            cardID: gameInfo?.loanInfo?.cardID!,
            targetUserID: gameInfo?.loanInfo?.targetUserID!,
          },
        };

        const request: LoanSuccessRequest = {
          userID: currentUser?.id,
          event: SUCCESS_LOAN,
          roomID: Number(roomID),
          message: JSON.stringify(body),
        };

        ws?.send(JSON.stringify(request));
      } else {
        const body: WinRequestBody = {
          cards: items.map((card) => ({ cardID: card.id })),
          playTurn: gameInfo?.playTurn as number,
          score: scoreResult.score,
        };

        const request: WinRequest = {
          userID: currentUser?.id,
          event: REQUEST_WIN,
          roomID: Number(roomID),
          message: JSON.stringify(body),
        };

        ws?.send(JSON.stringify(request));
      }
    }
  };

  const onSuteru = () => {
    if (isUserLoan) {
      if (gameInfo?.loanInfo?.cardID) {
        const body: LoanFailedBody = {
          cardID: gameInfo?.loanInfo?.cardID,
          playTurn: gameInfo?.playTurn,
          targetUserID: gameInfo?.loanInfo.targetUserID,
        };

        const req: LoanFailedRequest = {
          roomID: Number(roomID),
          message: JSON.stringify(body),
          event: FAILED_LOAN,
        };

        ws?.send(JSON.stringify(req));

        audioRef.current?.play();
      }
    } else {
      setDiscardMode(!discardMode);
    }
  };

  const doraImage = cards.find((ci) => ci.id === gameInfo?.dora?.cardID);

  const isActive = gameInfo?.loanInfo
    ? gameInfo.loanInfo.userID === currentUser?.id
    : currentUser?.turnNumber === gameInfo?.playTurn;

  return (
    <div className="h-[120px] flex items-center justify-center relative">
      <div className="flex justify-center items-center gap-4">
        <div className="flex justify-center items-center border-white border-2 py-4 px-8 rounded-xl bg-white/20">
          {doraImage ? (
            <div className="flex gap-8 items-center">
              <Image
                src={doraImage.imageSrc}
                alt={doraImage.color + doraImage.name}
                width={40}
                height={58}
              />
              <p className="font-bold text-white">
                {m("dora")} <br />
                +1{m("score")}
              </p>
            </div>
          ) : (
            <p className="text-center">
              {m("noDora1")} <br /> {m("noDora2")}
            </p>
          )}
        </div>

        <div
          className={`flex justify-center items-center border-2 px-4 py-2 gap-4 rounded-xl bg-white/20 ${
            isActive ? "border-red-500" : "border-white"
          }`}
        >
          <p className="font-bold text-xl text-white">
            {scoreResult.score}
            {m("score")}
          </p>
          <div className="flex flex-col items-center gap-2">
            <div className="min-w-[60px] flex items-center h-[80px] p-2 rounded">
              {userCardImages && items ? (
                <MyCardList
                  items={items}
                  setItems={setItems}
                  discardMode={discardMode}
                  handleDiscard={handleDiscard}
                  roomID={roomID}
                  calScore={calScore}
                />
              ) : (
                <p className="text-center">
                  {m("noCards1")} <br /> {m("noCards2")}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="flex">
          <div className="w-24 flex flex-col gap-1">
            <button
              disabled={!isFullSixCard || scoreResult.score < 5}
              onClick={handleWin}
              className="text-white p-2 rounded-xl font-bold bg-orange-800 disabled:bg-gray-500 disabled:text-gray-400"
            >
              {isUserLoan ? m("loanVictory") : m("normalVictory")}
            </button>
            <button
              disabled={!isFullSixCard}
              onClick={onSuteru}
              className={`text-white p-2 rounded-xl font-bold ${
                discardMode ? "bg-gray-400" : "bg-gray-600"
              } disabled:bg-gray-500 disabled:text-gray-400`}
            >
              {discardMode ? m("cancelSuteru") : m("suteru")}
            </button>
          </div>
          <div className="w-24 ml-1 flex justify-center flex-col gap-2">
            <button
              disabled={
                !(
                  gameInfo?.isLoanAllowed &&
                  currentUser?.turnNumber!! !==
                    getPrevTurn(gameInfo?.playTurn!!, totalUsers!!) &&
                  !isLoanEnd
                )
              }
              onClick={() => setIsLoanSelectMode(!isLoanSelectMode)}
              className={`h-full text-white p-2 rounded-xl font-bold disabled:bg-gray-500 disabled:text-gray-400 ${
                isLoanSelectMode ? "bg-blue-800" : "bg-red-800"
              }`}
            >
              {isLoanSelectMode ? m("cancelLoan") : m("loan")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyCardBoard;
