"use client";

import cards, { CardImage } from "@/app/(game)/rooms/[roomID]/game/cards";
import { MouseEventHandler } from "react";

type CardProps = {
  card: CardImage;
  onClick?: MouseEventHandler<HTMLElement>;
  disabled: boolean;
  isSelected: boolean;
};

const Card = ({ card, onClick, disabled, isSelected }: CardProps) => {
  const cardImage = cards.find((cardImage) => cardImage.id === card.id);

  if (!cardImage) {
    return <></>;
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-[40px] h-[58px] border border-red-400 disabled:border-gray-200 ${
        isSelected ? "bg-blue-400" : "bg-white"
      }`}
    >
      {card.id}
    </button>
  );
};

export default Card;
