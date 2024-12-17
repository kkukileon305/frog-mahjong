"use client";

import { SubmitHandler, useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { getCookie } from "cookies-next";
import useFrogMahjongStore from "@/utils/stores/frog-mahjong/useFrogMahjongStore";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

import "swiper/css";

const ChatEmoji = () => {
  const { gameState, roomID, ws } = useFrogMahjongStore((s) => ({
    gameState: s.gameState,
    roomID: s.gameState?.gameInfo?.roomID,
    ws: s.ws,
  }));

  const userID = getCookie("userID") as string;
  const currentUser = gameState?.users?.find(
    (user) => user.id === Number(userID)
  );

  const emojis = ["a", "b", "c", "d", "e", "f", "g", "h"];

  const sendEmoji = (e: string) => {
    const request = {
      userID: currentUser?.id!,
      roomID: Number(roomID),
      event: "CHAT",
      message: e,
      name: currentUser?.name,
    };

    ws?.send(JSON.stringify(request));
  };

  return (
    <Swiper
      className="w-full h-full flex"
      modules={[Navigation]}
      spaceBetween={0}
      slidesPerView={5}
      style={{
        padding: 4,
      }}
    >
      {emojis.map((e) => (
        <SwiperSlide key={e} className="w-fit">
          <button
            onClick={() => sendEmoji(e)}
            className="flex justify-center items-center bg-green-400 rounded-full h-full aspect-square"
          >
            {e}
          </button>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default ChatEmoji;
