"use client";

import { GameInfo, UserSocket } from "@/utils/socketTypes";
import cards, { CardImage } from "@/app/(game)/rooms/[roomID]/game/cards";
import Image from "next/image";

type MyCardProps = {
  currentUser?: UserSocket;
  isUserTurn: boolean;
  gameInfo: GameInfo | null;
};

const MyCards = ({ currentUser, isUserTurn, gameInfo }: MyCardProps) => {
  const userCardImages = currentUser?.cards?.map(
    (card) =>
      cards.find((cardImage) => cardImage.id === card.cardID) as CardImage
  );

  const userDiscardImages = currentUser?.discardedCards?.map(
    (card) =>
      cards.find((cardImage) => cardImage.id === card.cardID) as CardImage
  );

  return (
    <div
      className={`relative h-[160px] border-r border-black flex justify-center items-center gap-4 ${
        isUserTurn ? "bg-red-400" : "bg-gray-400"
      }`}
    >
      <p className="absolute bottom-2 right-2">
        {isUserTurn
          ? `${gameInfo?.dora ? "패를 선택해주세요" : "도라를 골라주세요"}`
          : `차례가 올 때까지 기다려주세요`}
      </p>
      <div className="flex flex-col items-center gap-2">
        {/* TODO: 드래그해서 조합 확인해볼 수 있게 */}

        <div className="min-w-[60px] flex items-center gap-2 h-[80px] border p-2 rounded">
          {userCardImages ? (
            userCardImages?.map((ci) => (
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
              아직 가진 패가 <br /> 없습니다
            </p>
          )}
        </div>

        <p>가진 패</p>
      </div>

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

        <p>버린 패</p>
      </div>
    </div>
  );
};

export default MyCards;
