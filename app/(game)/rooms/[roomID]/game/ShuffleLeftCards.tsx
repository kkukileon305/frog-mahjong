"use client";

import Card from "@/app/(game)/rooms/[roomID]/game/Card";
import { CardImage } from "@/app/(game)/rooms/[roomID]/game/cards";
import { useEffect, useState } from "react";
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

  const [shuffledCards, setShuffledCards] = useState<CardImage[]>(
    leftCards.sort(() => Math.random() - 0.5)
  );

  useEffect(() => {
    if (leftCards.length !== shuffledCards.length) {
      setShuffledCards(leftCards.sort(() => Math.random() - 0.5));
    }
  }, [leftCards]);

  if (shuffledCards.length === 0 && isUserTurn && !isLoan && !isFullSixCard) {
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
    <div className="max-w-[600px] w-full h-full grid grid-cols-12 grid-rows-4 gap-1 py-12">
      {shuffledCards.map((card) => (
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
      ))}
    </div>
  );
};

export default ShuffleLeftCards;
