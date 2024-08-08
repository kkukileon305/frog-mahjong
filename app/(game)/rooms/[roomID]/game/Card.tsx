"use client";

import { CardImage } from "@/app/(game)/rooms/[roomID]/game/cards";
import { MouseEventHandler } from "react";

type CardProps = {
  card: CardImage;
  onClick?: MouseEventHandler<HTMLElement>;
  disabled: boolean;
};

const Card = ({ card, onClick, disabled }: CardProps) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="w-[40px] h-[58px] border border-red-400 disabled:border-gray-200"
    />
  );
};

export default Card;
