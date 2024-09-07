"use client";

import React, { Dispatch, SetStateAction } from "react";
import { UserSocket } from "@/utils/constants/socketTypes";
import cards from "@/app/(game)/rooms/[roomID]/game/cards";
import Image from "next/image";
import { useTranslations } from "next-intl";

type LoanFailedModalProps = {
  isLoanFailed: number;
  setIsLoanFailed: Dispatch<SetStateAction<number>>;
  users: UserSocket[] | null;
};

const LoanFailedModal = ({
  setIsLoanFailed,
  isLoanFailed,
  users,
}: LoanFailedModalProps) => {
  const m = useTranslations("LoanFailedModal");

  const failedUser = users?.find((user) => user.id === isLoanFailed)!!;
  const cardImages = failedUser.cards?.map(
    (card) => cards.find((ci) => ci.id === card.cardID)!!
  )!!;

  const init = () => {
    setIsLoanFailed(0);
  };

  return (
    <div className="absolute flex justify-center items-center w-full h-full left-0 top-0 bg-black/50 z-10">
      <div className="bg-white max-w-3xl w-full rounded-xl p-8">
        <h3 className="text-3xl font-bold mb-8 text-center">
          {failedUser.name}
          {m("title")}
        </h3>

        <div className="flex gap-2 justify-center">
          {cardImages.map((card, index) => (
            <Image
              src={card?.imageSrc!}
              alt={card?.color! + card?.name!}
              width={40}
              height={58}
              draggable={false}
              key={card?.id!}
            />
          ))}
        </div>
        <button
          onClick={init}
          className="w-full bg-sky-500 rounded-lg py-3 text-white font-bold disabled:bg-gray-400 mt-4"
        >
          {m("back")}
        </button>
      </div>
    </div>
  );
};

export default LoanFailedModal;
