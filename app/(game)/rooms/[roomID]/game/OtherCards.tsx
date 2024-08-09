"use client";

import { UserSocket } from "@/utils/socketTypes";
import cards, { CardImage } from "@/app/(game)/rooms/[roomID]/game/cards";
import Image from "next/image";

type OtherCard = {
  user?: UserSocket;
  playTurn?: number;
};

const OtherCards = ({ user, playTurn }: OtherCard) => {
  const userDiscardImages = user?.discardedCards?.map(
    (card) =>
      cards.find((cardImage) => cardImage.id === card.cardID) as CardImage
  );

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
              <Image
                src={ci.imageSrc}
                alt={ci.color + ci.name}
                key={ci.id}
                width={40}
                height={58}
              />
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
