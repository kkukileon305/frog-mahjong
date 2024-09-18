"use client";

import { Reorder } from "framer-motion";
import Image from "next/image";
import { Dispatch, SetStateAction, useRef } from "react";
import { CardImage } from "@/app/(game)/rooms/quick-game/game/cards";
import { IoRemoveCircle } from "react-icons/io5";
import useSoundStore from "@/utils/hooks/useSoundStore";

type MyCardListProps = {
  items: CardImage[];
  discardMode: boolean;
  handleDiscard: (card: CardImage) => void;
  roomID: number;
  calScore: (card: CardImage[]) => void;
  setItems: Dispatch<SetStateAction<CardImage[]>>;
};

const MyCardList = ({
  items,
  discardMode,
  handleDiscard,
  calScore,
  setItems,
}: MyCardListProps) => {
  const audios = useSoundStore((s) => s.audios);

  const onDragEnd = async () => {
    calScore(items);
    await audios?.cardMovieAudio.play();
  };

  if (discardMode) {
    return (
      <div className="flex gap-2">
        {items.map((item, i) => (
          <button
            key={item.id}
            onClick={() => handleDiscard(item)}
            className={`group relative ${i === 2 && "mr-4"}`}
            disabled={!discardMode}
          >
            <Image
              src={item.imageSrc}
              alt={item.color + item.name}
              width={40}
              height={58}
              draggable={false}
            />

            <IoRemoveCircle
              color="red"
              className="w-8 h-8 invisible absolute group-hover:visible left-[calc(50%-16px)] top-[calc(50%-16px)]"
            />
          </button>
        ))}
      </div>
    );
  }

  return (
    <Reorder.Group
      className="flex gap-2"
      axis="x"
      values={items}
      onReorder={setItems}
    >
      {items.map((item, i) => (
        <Reorder.Item
          className={`cursor-pointer ${i === 2 && "mr-4"}`}
          key={item.id}
          value={item}
          onDragEnd={onDragEnd}
        >
          <Image
            src={item.imageSrc}
            alt={item.color + item.name}
            width={40}
            height={58}
            draggable={false}
          />
        </Reorder.Item>
      ))}
    </Reorder.Group>
  );
};

export default MyCardList;
