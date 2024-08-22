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
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import axiosInstance, { Result } from "@/utils/axios";
import { getCookie } from "cookies-next";
import getPrevTurn from "@/utils/getPrevTurn";

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
};

const MyCardBoard = ({
  currentUser,
  isUserTurn,
  gameInfo,
  roomID,
  ws,
  discardMode,
  setDiscardMode,
  totalUsers,
  isLoanSelectMode,
  setIsLoanSelectMode,
  isUserLoan,
}: MyCardProps) => {
  const [result, setResult] = useState<Result>({
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

  const userDiscardImages = currentUser?.discardedCards?.map(
    (card) =>
      cards.find((cardImage) => cardImage.id === card.cardID) as CardImage
  );

  const calScore = async (values: CardImage[]) => {
    if (values.length === 6) {
      try {
        const { data } = await axiosInstance.post<Result>(
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

        setResult(data);
      } catch (e) {
        console.log(e);
        setResult({
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
        event: "DISCARD",
        roomID: Number(roomID),
        message: JSON.stringify(body),
      };

      ws?.send(JSON.stringify(request));
      setDiscardMode(false);
      setResult({
        score: 0,
        bonuses: [],
      });
    }
  };

  const handleWin = () => {
    if (isFullSixCard && result.score >= 5) {
      if (isUserLoan) {
        const body: LoanSuccessBody = {
          cards: items.map((card) => ({ cardID: card.id })),
          playTurn: gameInfo?.playTurn as number,
          score: result.score,
          loanInfo: {
            cardID: gameInfo?.loanInfo?.cardID!,
            targetUserID: gameInfo?.loanInfo?.targetUserID!,
          },
        };

        const request: LoanSuccessRequest = {
          userID: currentUser?.id,
          event: "SUCCESS_LOAN",
          roomID: Number(roomID),
          message: JSON.stringify(body),
        };

        ws?.send(JSON.stringify(request));
      } else {
        const body: WinRequestBody = {
          cards: items.map((card) => ({ cardID: card.id })),
          playTurn: gameInfo?.playTurn as number,
          score: result.score,
        };

        const request: WinRequest = {
          userID: currentUser?.id,
          event: "REQUEST_WIN",
          roomID: Number(roomID),
          message: JSON.stringify(body),
        };

        ws?.send(JSON.stringify(request));
      }
    }
  };

  const isActive = gameInfo?.loanInfo ? isUserLoan : isUserTurn;

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
          event: "FAILED_LOAN",
        };

        ws?.send(JSON.stringify(req));
      }
    } else {
      setDiscardMode(!discardMode);
    }
  };

  return (
    <div
      className={`relative h-[260px] border-r border-t border-black ${
        isActive ? "bg-red-400" : "bg-gray-400"
      }`}
    >
      <div className="h-[120px] flex justify-center items-center border-b border-black">
        <div className="flex flex-col items-center gap-2">
          <div className="min-w-[60px] flex items-center gap-2 h-[80px] border p-2 rounded">
            {userDiscardImages ? (
              userDiscardImages?.map((ci) => (
                <Image
                  src={ci.imageSrc}
                  alt={ci.color + ci.name}
                  key={ci.id}
                  width={40}
                  height={58}
                />
              ))
            ) : (
              <p className="text-center">
                아직 버린 패가 <br /> 없습니다
              </p>
            )}
          </div>
        </div>
      </div>
      <div className="h-[140px] flex justify-center items-center gap-4">
        <p className="font-bold text-xl text-white">{result.score}점</p>
        <div className="flex flex-col items-center gap-2">
          <div className="min-w-[60px] flex items-center h-[80px] border p-2 rounded">
            {userCardImages && items ? (
              <MyCardList
                items={items}
                setItems={setItems}
                discardMode={discardMode}
                handleDiscard={handleDiscard}
                setResult={setResult}
                roomID={roomID}
                calScore={calScore}
              />
            ) : (
              <p className="text-center">
                아직 가진 패가 <br /> 없습니다
              </p>
            )}
          </div>
        </div>

        <div className="flex">
          <div className="w-24 flex flex-col gap-2">
            <button
              disabled={!isFullSixCard || result.score < 5}
              onClick={handleWin}
              className="text-white p-2 rounded-xl font-bold bg-orange-800 disabled:bg-gray-500 disabled:text-gray-400"
            >
              쯔모!
            </button>
            <button
              disabled={!isFullSixCard}
              onClick={onSuteru}
              className={`text-white p-2 rounded-xl font-bold ${
                discardMode ? "bg-gray-400" : "bg-gray-600"
              } disabled:bg-gray-500 disabled:text-gray-400`}
            >
              {discardMode ? "버리기 취소" : "버리기"}
            </button>
          </div>
          <div className="w-24 ml-4 flex justify-center flex-col gap-2">
            <button
              disabled={
                !(
                  gameInfo?.isLoanAllowed &&
                  currentUser?.turnNumber!! !==
                    getPrevTurn(gameInfo?.playTurn!!, totalUsers!!)
                )
              }
              onClick={() => setIsLoanSelectMode(!isLoanSelectMode)}
              className={`h-full text-white p-2 rounded-xl font-bold bg-red-800 disabled:bg-gray-500 disabled:text-gray-400 ${
                isLoanSelectMode && "bg-blue-800"
              }`}
            >
              론!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyCardBoard;
