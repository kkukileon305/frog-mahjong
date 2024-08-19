"use client";

import {
  GameInfo,
  LoanBody,
  LoanRequest,
  UserSocket,
} from "@/utils/socketTypes";
import cards, { CardImage } from "@/app/(game)/rooms/[roomID]/game/cards";
import Image from "next/image";
import { Dispatch, SetStateAction, useEffect } from "react";

type OtherCard = {
  user?: UserSocket;
  playTurn?: number;
  isLoanSelectMode: boolean;
  setIsLoanSelectMode: Dispatch<SetStateAction<boolean>>;
  ws: null | WebSocket;
  gameInfo: GameInfo | null;
  roomID: number;
};

const OtherCards = ({
  user,
  playTurn,
  ws,
  gameInfo,
  isLoanSelectMode,
  setIsLoanSelectMode,
  roomID,
}: OtherCard) => {
  const userDiscardImages = user?.discardedCards?.map(
    (card) =>
      cards.find((cardImage) => cardImage.id === card.cardID) as CardImage
  );

  const onLoanCard = (ci: CardImage) => {
    if (gameInfo?.loanInfo === null && isLoanSelectMode) {
      const requestBody: LoanBody = {
        cardID: ci.id,
        playTurn: gameInfo?.playTurn,
        targetUserID: user?.id!,
      };

      const request: LoanRequest = {
        roomID,
        message: JSON.stringify(requestBody),
        event: "LOAN",
      };

      ws?.send(JSON.stringify(request));

      setIsLoanSelectMode(false);
    }
  };

  useEffect(() => {
    if (gameInfo?.loanInfo) {
      setIsLoanSelectMode(false);
    }
  }, [gameInfo?.loanInfo]);

  return (
    <div
      className={`border-t p-2 border-black ${
        user?.turnNumber === playTurn ? "bg-red-400" : "bg-green-500"
      }`}
    >
      <p>{user?.name}의 버린패</p>
      <div className="flex flex-col gap-2 mt-2">
        {userDiscardImages ? (
          <div className="min-w-[60px] min-h-[80px] flex gap-2 border p-2 rounded flex-wrap">
            {userDiscardImages?.map((ci) => (
              <button
                key={ci.id}
                disabled={!isLoanSelectMode}
                className="border border-red-400 disabled:border-gray-200"
                onClick={() => onLoanCard(ci)}
              >
                <Image
                  src={ci.imageSrc}
                  alt={ci.color + ci.name}
                  width={40}
                  height={58}
                />
              </button>
            ))}
          </div>
        ) : (
          <div className="h-20 flex justify-center items-center border p-2 rounded">
            <p className="text-center">
              아직 버린 패가 <br /> 없습니다
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OtherCards;
