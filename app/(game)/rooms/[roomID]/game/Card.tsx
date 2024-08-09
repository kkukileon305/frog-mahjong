"use client";

import cards, { CardImage } from "@/app/(game)/rooms/[roomID]/game/cards";
import { MouseEventHandler } from "react";
import Image from "next/image";

type CardProps = {
  card: CardImage;
  onClick?: MouseEventHandler<HTMLElement>;
  disabled: boolean;
};

const Card = ({ card, onClick, disabled }: CardProps) => {
  const cardImage = cards.find((cardImage) => cardImage.id === card.id);

  if (!cardImage) {
    return <></>;
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="w-[40px] h-[58px] bg-white border border-red-400 disabled:border-gray-200"
    />
  );
};

export default Card;
