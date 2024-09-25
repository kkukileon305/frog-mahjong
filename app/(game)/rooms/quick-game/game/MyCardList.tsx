"use client";

import { Reorder } from "framer-motion";
import Image from "next/image";
import { Dispatch, SetStateAction, useRef } from "react";
import { CardImage } from "@/app/(game)/rooms/quick-game/game/cards";
import { IoRemoveCircle } from "react-icons/io5";
import useSoundStore from "@/utils/stores/useSoundStore";

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
      <div className="h-full flex gap-2">
        {items.map((item, i) => (
          <button
            key={item.id}
            onClick={() => handleDiscard(item)}
            className={`h-full group relative ${i === 2 && "mr-4"}`}
            disabled={!discardMode}
          >
            <div className="h-full aspect-[40/58]">
              <Image
                src={item.imageSrc}
                alt={item.color + item.name}
                fill
                draggable={false}
                className="w-full h-full"
              />
            </div>

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
      className="w-full h-full flex gap-2"
      axis="x"
      values={items}
      onReorder={setItems}
    >
      {items.map((item, i) => (
        <Reorder.Item
          className={`cursor-pointer h-full ${i === 2 && "mr-4"}`}
          key={item.id}
          value={item}
          onDragEnd={onDragEnd}
        >
          <div className="h-full aspect-[40/58]">
            <Image
              src={item.imageSrc}
              alt={item.color + item.name}
              width={40}
              height={58}
              draggable={false}
              className="w-full h-full"
            />
          </div>
        </Reorder.Item>
      ))}
    </Reorder.Group>
  );
};

export default MyCardList;
