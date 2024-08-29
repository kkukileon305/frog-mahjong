"use client";

import Card from "@/app/(game)/rooms/[roomID]/game/Card";
import { CardImage } from "@/app/(game)/rooms/[roomID]/game/cards";
import { useEffect, useState } from "react";

type ShuffleLeftCardsProps = {
  leftCards: CardImage[];
  isUserTurn: boolean;
  isFullSixCard: boolean;
  onSelectCard: (card: CardImage) => void;
  selectedCards: CardImage[];
  isLoan: boolean;
  onGameOver: () => void;
};

const ShuffleLeftCards = ({
  onSelectCard,
  leftCards,
  selectedCards,
  isFullSixCard,
  isUserTurn,
  isLoan,
  onGameOver,
}: ShuffleLeftCardsProps) => {
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
          종료
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-[600px] w-full h-full grid grid-cols-12 gap-1 p-4">
      {shuffledCards.map((card) => (
        <div key={card.id} className="flex justify-center items-center">
          <Card
            card={card}
            disabled={!isUserTurn || isFullSixCard || isLoan}
            onClick={() => onSelectCard(card)}
            isSelected={selectedCards.includes(card)}
          />
        </div>
      ))}
    </div>
  );
};

export default ShuffleLeftCards;
