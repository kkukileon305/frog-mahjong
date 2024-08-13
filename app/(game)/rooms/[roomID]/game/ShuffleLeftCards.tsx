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
};

const ShuffleLeftCards = ({
  onSelectCard,
  leftCards,
  selectedCards,
  isFullSixCard,
  isUserTurn,
}: ShuffleLeftCardsProps) => {
  const [shuffledCards, setShuffledCards] = useState<CardImage[]>(
    leftCards.sort(() => Math.random() - 0.5)
  );

  useEffect(() => {
    if (leftCards.length !== shuffledCards.length) {
      setShuffledCards(leftCards.sort(() => Math.random() - 0.5));
    }
  }, [leftCards]);

  return (
    <div className="w-[400px] h-full grid grid-cols-10 gap-1 p-4">
      {shuffledCards.map((card) => (
        <div key={card.id} className="flex justify-center items-center">
          <Card
            card={card}
            disabled={!isUserTurn || isFullSixCard}
            onClick={() => onSelectCard(card)}
            isSelected={selectedCards.includes(card)}
          />
        </div>
      ))}
    </div>
  );
};

export default ShuffleLeftCards;
