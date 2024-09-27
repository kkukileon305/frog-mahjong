"use client";

import Card from "@/app/(game)/rooms/quick-game/game/Card";
import { CardImage } from "@/app/(game)/rooms/quick-game/game/cards";
import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";

type ShuffleLeftCardsProps = {
  leftCards: CardImage[];
  isUserTurn: boolean;
  isFullSixCard: boolean;
  onSelectCard: (card: CardImage) => void;
  selectedCards: CardImage[];
  isLoan: boolean;
  onGameOver: () => void;
  isLoanSelectMode: boolean;
};

const ShuffleLeftCards = ({
  onSelectCard,
  leftCards,
  selectedCards,
  isFullSixCard,
  isUserTurn,
  isLoan,
  onGameOver,
  isLoanSelectMode,
}: ShuffleLeftCardsProps) => {
  const m = useTranslations("ShuffleLeftCards");

  if (
    leftCards.filter((card) => card.isValid).length === 0 &&
    isUserTurn &&
    !isLoan &&
    !isFullSixCard
  ) {
    return (
      <div className="max-w-xl w-full flex justify-center items-center">
        <button
          onClick={onGameOver}
          className="p-2 rounded-xl bg-white font-bold text-xl"
        >
          {m("end")}
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-[400px] lg:max-w-[700px] w-full h-full grid grid-cols-11 grid-rows-4 gap-1 lg:gap-2 lg:py-8">
      {leftCards.map((card) =>
        card.isValid ? (
          <div key={card.id} className="flex justify-center items-center">
            <Card
              card={card}
              disabled={
                !isUserTurn || isFullSixCard || isLoan || isLoanSelectMode
              }
              onClick={() => onSelectCard(card)}
              isSelected={selectedCards.includes(card)}
            />
          </div>
        ) : (
          <div key={card.id} className="w-full h-full"></div>
        )
      )}
    </div>
  );
};

export default ShuffleLeftCards;
