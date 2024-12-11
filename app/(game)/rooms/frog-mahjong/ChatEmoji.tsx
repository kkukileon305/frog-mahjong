"use client";

import { SubmitHandler, useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { getCookie } from "cookies-next";
import useFrogMahjongStore from "@/utils/stores/frog-mahjong/useFrogMahjongStore";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";

type Inputs = {
  message: string;
};

const ChatEmoji = () => {
  const m = useTranslations("ChatForm");
  const { gameState, roomID, ws } = useFrogMahjongStore((s) => ({
    gameState: s.gameState,
    roomID: s.gameState?.gameInfo?.roomID,
    ws: s.ws,
  }));

  const userID = getCookie("userID") as string;
  const currentUser = gameState?.users?.find(
    (user) => user.id === Number(userID)
  );

  const { register, reset, handleSubmit } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = (inputs) => {
    const request = {
      userID: currentUser?.id!,
      roomID: Number(roomID),
      event: "CHAT",
      message: inputs.message,
      name: currentUser?.name,
    };

    ws?.send(JSON.stringify(request));
    reset();
  };

  const emojis = [1, 2, 3, 4, 5, 6, 7, 8];

  return (
    <Swiper
      className="w-full h-full flex"
      spaceBetween={50}
      slidesPerView="auto"
      style={{
        padding: 4,
      }}
    >
      {emojis.map((e) => (
        <SwiperSlide key={e}>
          <div className="flex justify-center items-center bg-green-400 rounded-full h-full aspect-square">
            {e}
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default ChatEmoji;
