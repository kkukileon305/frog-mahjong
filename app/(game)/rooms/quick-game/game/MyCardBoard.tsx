"use client";

import {
  DiscardBody,
  DiscardRequest,
  LoanFailedBody,
  LoanFailedRequest,
  LoanSuccessBody,
  LoanSuccessRequest,
  WinRequest,
  WinRequestBody,
} from "@/utils/constants/socketTypes";
import cards, { CardImage } from "@/app/(game)/rooms/quick-game/game/cards";
import Image from "next/image";
import MyCardList from "@/app/(game)/rooms/quick-game/game/MyCardList";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import axiosInstance, { ScoreResult } from "@/utils/axios";
import { getCookie } from "cookies-next";
import getPrevTurn from "@/utils/functions/getPrevTurn";
import {
  DISCARD,
  FAILED_LOAN,
  REQUEST_WIN,
  SUCCESS_LOAN,
} from "@/utils/constants/const";
import { useTranslations } from "next-intl";
import useGameStore from "@/utils/stores/useGameStore";
import useSoundStore from "@/utils/stores/useSoundStore";

type MyCardProps = {
  discardMode: boolean;
  setDiscardMode: Dispatch<SetStateAction<boolean>>;
  isLoanSelectMode: boolean;
  setIsLoanSelectMode: Dispatch<SetStateAction<boolean>>;
  isUserLoan: boolean;
  isLoanEnd: boolean;
  selectedCards: CardImage[];
};

const MyCardBoard = ({
  discardMode,
  setDiscardMode,
  isLoanSelectMode,
  setIsLoanSelectMode,
  isUserLoan,
  isLoanEnd,
  selectedCards,
}: MyCardProps) => {
  const m = useTranslations("MyCardBoard");
  const { gameInfo, users, ws, isGetCard } = useGameStore((s) => ({
    gameInfo: s.gameState?.gameInfo,
    ws: s.ws,
    users: s.gameState?.users,
    isGetCard: s.isGetCard,
  }));

  const userID = getCookie("userID") as string;
  const roomID = gameInfo?.roomID;
  const currentUser = users?.find((user) => user.id === Number(userID));

  const audios = useSoundStore((s) => s.audios);

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

      audios?.cardChapAudio.play();
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

        audios?.cardChapAudio.play();
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
    <div className="h-[60px] lg:h-[120px] flex items-center justify-center relative">
      <div className="flex justify-center items-center gap-2 lg:gap-4">
        <div className="flex justify-center items-center border-white border-2 p-2 lg:py-4 lg:px-8 rounded-xl bg-white/20">
          {doraImage ? (
            <div className="flex gap-4 lg:gap-8 items-center">
              <Image
                src={doraImage.imageSrc}
                alt={doraImage.color + doraImage.name}
                width={40}
                height={58}
                className="w-6"
              />
              <p className="hidden lg:block text-xs lg:text-base font-bold text-white text-center">
                {m("dora")} <br />
                +1{m("score")}
              </p>
            </div>
          ) : (
            <p className="text-center text-xs lg:text-base">
              {m.rich("noDora", {
                br: () => <br />,
              })}
            </p>
          )}
        </div>

        <div
          className={`flex justify-center items-center border-2 px-4 lg:py-2 gap-4 rounded-xl bg-white/20 ${
            isActive ? "border-red-500" : "border-white"
          }`}
        >
          <p className="w-8 font-bold text-xs lg:text-xl text-white">
            {scoreResult.score}
            <span className="">{m("score")}</span>
          </p>
          <div className="flex flex-col items-center gap-2">
            <div className="lg:min-w-[60px] flex items-center h-14 lg:h-[80px] p-2 rounded">
              {userCardImages && items ? (
                <MyCardList
                  items={items}
                  setItems={setItems}
                  discardMode={discardMode}
                  handleDiscard={handleDiscard}
                  roomID={roomID!}
                  calScore={calScore}
                />
              ) : (
                <p className="text-center text-xs lg:text-base">
                  {m.rich("noCards", {
                    br: () => <br />,
                  })}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="flex">
          <div className="w-12 lg:w-24 flex flex-col gap-1">
            <button
              disabled={!isFullSixCard || scoreResult.score < 5}
              onClick={handleWin}
              className="text-xs lg:text-base text-white p-1 lg:p-2 rounded-xl font-bold bg-orange-800 disabled:bg-gray-500 disabled:text-gray-400"
            >
              {isUserLoan ? m("loanVictory") : m("normalVictory")}
            </button>
            <button
              disabled={!isFullSixCard}
              onClick={onSuteru}
              className={`text-xs truncate lg:text-base text-white p-1 lg:p-2 rounded-xl font-bold ${
                discardMode ? "bg-gray-400" : "bg-gray-600"
              } disabled:bg-gray-500 disabled:text-gray-400`}
            >
              {discardMode ? m("cancelSuteru") : m("suteru")}
            </button>
          </div>
          <div className="w-12 lg:w-24 ml-1 flex justify-center flex-col gap-2">
            <button
              disabled={
                !(
                  gameInfo?.isLoanAllowed &&
                  currentUser?.turnNumber!! !==
                    getPrevTurn(gameInfo?.playTurn!!, users?.length!!) &&
                  !isLoanEnd &&
                  selectedCards.length === 0 &&
                  !isGetCard
                )
              }
              onClick={() => setIsLoanSelectMode(!isLoanSelectMode)}
              className={`text-xs lg:text-base h-full text-white p-2 rounded-xl font-bold disabled:bg-gray-500 disabled:text-gray-400 ${
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
