"use client";

import { Reorder } from "framer-motion";
import Image from "next/image";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { CardImage } from "@/app/(game)/rooms/[roomID]/game/cards";
import { IoRemoveCircle } from "react-icons/io5";
import axiosInstance, { Result } from "@/utils/axios";
import { getCookie } from "cookies-next";

type MyCardListProps = {
  userCardImages: CardImage[];
  discardMode: boolean;
  handleDiscard: (card: CardImage) => void;
  setResult: Dispatch<SetStateAction<Result>>;
  roomID: string;
};

const MyCardList = ({
  userCardImages,
  discardMode,
  handleDiscard,
  setResult,
  roomID,
}: MyCardListProps) => {
  const [items, setItems] = useState<CardImage[]>(userCardImages);

  const calScore = async (values: CardImage[]) => {
    if (values.length === 6) {
      try {
        const { data } = await axiosInstance.post<Result>(
          "/v0.1/game/score/calculate",
          {
            cards: values.map((ci) => ({ cardID: ci.id })),
            roomID: Number(roomID),
          },
          {
            headers: {
              tkn: getCookie("accessToken"),
            },
          }
        );

        setResult(data);
      } catch (e) {
        console.log(e);
        setResult({
          score: 0,
          bonuses: [],
        });
      }
    }
  };

  const onDragEnd = async () => {
    await calScore(items);
  };

  useEffect(() => {
    const newItems = userCardImages.sort((ci) => ci.id);
    const oldItems = items.sort((ci) => ci.id);

    // 길이가 같다면 같은 패로 간주
    if (newItems.length !== oldItems.length) {
      if (newItems.length > oldItems.length) {
        // 추가 된 경우
        const newItem = newItems.find(
          (nic) => !oldItems.find((oic) => oic.id === nic.id)
        )!!;

        const newList = [...items, newItem];
        calScore(newList);
        setItems(newList);
      } else {
        // 빠진 경우
        const removedItem = oldItems.find(
          (oic) => !newItems.find((nic) => oic.id === nic.id)
        )!!;

        setItems(items.filter((item) => item.id !== removedItem.id));
      }
    }
  }, [userCardImages]);

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
