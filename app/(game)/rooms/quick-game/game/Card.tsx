"use client";

import cards, { CardImage } from "@/app/(game)/rooms/quick-game/game/cards";
import { MouseEventHandler } from "react";
import Image from "next/image";
import Sealed from "@/public/cards/sealed.jpg";

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
      className={`w-full h-full rounded overflow-hidden border border-red-400 disabled:border-gray-200 ${
        isSelected ? "bg-red-400" : "bg-white"
      }`}
    >
      {!isSelected && (
        <Image
          className="w-full h-full object-fill"
          width={50}
          height={62.5}
          src={Sealed.src}
          alt={"sealed card"}
        />
      )}

      {process.env.NODE_ENV === "development" && (
        <p className="absolute">
          {card.id} {card.isValid ? "true" : "false"}
        </p>
      )}
    </button>
  );
};

export default Card;
