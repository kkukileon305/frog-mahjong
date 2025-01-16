"use client";

import { getCookie } from "cookies-next";
import useWingspanStore from "@/utils/stores/wingspan/useWingspanStore";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import getEmojiFromName, {
  emojiNames,
} from "@/utils/functions/getEmojiFromName";

const ChatEmoji = () => {
  const { gameState, roomID, ws } = useWingspanStore((s) => ({
    gameState: s.gameState,
    roomID: s.gameState?.gameInfo?.roomID,
    ws: s.ws,
  }));

  const userID = getCookie("userID") as string;
  const currentUser = gameState?.users?.find(
    (user) => user.id === Number(userID)
  );

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
      slidesPerView={6}
      style={{
        padding: 4,
      }}
    >
      {emojiNames.map((e) => (
        <SwiperSlide key={e} className="w-fit">
          <button
            onClick={() => sendEmoji(e)}
            className="flex justify-center items-center rounded-full w-8 h-full aspect-square"
          >
            <img src={getEmojiFromName(e)?.src} alt="" />
          </button>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default ChatEmoji;
