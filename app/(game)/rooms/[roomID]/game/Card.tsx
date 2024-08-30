"use client";

import cards, { CardImage } from "@/app/(game)/rooms/[roomID]/game/cards";
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
      className={`w-[40px] h-[58px] rounded overflow-hidden border border-red-400 disabled:border-gray-200 ${
        isSelected ? "bg-red-400" : "bg-white"
      }`}
    >
      {!isSelected && (
        <Image
          className="w-full h-full object-fill"
          width={40}
          height={58}
          src={Sealed.src}
          alt={"sealed card"}
        />
      )}
      <p className="absolute">{card.id}</p>
    </button>
  );
};

export default Card;
