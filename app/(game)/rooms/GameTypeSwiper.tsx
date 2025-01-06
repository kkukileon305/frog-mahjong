"use client";

import React, { useEffect, useRef } from "react";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { Swiper as SwiperType } from "swiper";

import "swiper/css";
import { StaticImageData } from "next/image";
import Wingspan from "@/public/game-types/wingspan.png";
import { useTranslations } from "next-intl";
import FrogMahjong from "@/public/game-types/frog-mahjong.png";
import useMatchSettingStore, {
  GameType,
} from "@/utils/stores/useMatchSettingStore";
import GreenArrow from "@/public/icons/green_arrow.png";

type GameMenu = {
  name: string;
  gameType: GameType;
  image: StaticImageData;
};

const GameTypeSwiper = () => {
  const m = useTranslations("MatchSettingForm");

  const swiperRef = useRef<SwiperType>();

  const { gameType, setGameType } = useMatchSettingStore((s) => ({
    gameType: s.gameType,
    setGameType: s.setGameType,
  }));

  const games: GameMenu[] = [
    {
      name: m("FROG_MAHJONG"),
      image: Wingspan,
      gameType: "WINGSPAN",
    },
    {
      name: m("FROG_MAHJONG_OLD"),
      image: FrogMahjong,
      gameType: "FROG_MAHJONG_OLD",
    },
  ];

  const handleGameTypeChange = (index: number) => {
    const newType = games[index].gameType;

    setGameType(newType);
    localStorage.setItem("gameType", newType);
  };

  useEffect(() => {
    if (swiperRef.current) {
      const prevType = localStorage.getItem("gameType") as GameType | null;

      if (prevType) {
        setGameType(localStorage.getItem("gameType") as GameType);
        setGameType(localStorage.getItem("gameType") as GameType);
        const idx = games.findIndex((game) => game.gameType === prevType);
        swiperRef.current.slideTo(idx);
      }
    }
  }, [swiperRef.current]);

  return (
    <div className="relative">
      <Swiper
        className="border my-2 flex bg-white"
        onBeforeInit={(swiper) => {
          swiperRef.current = swiper;
        }}
        modules={[Navigation]}
        spaceBetween={0}
        slidesPerView={2}
        style={{
          padding: 4,
        }}
        centeredSlides
        onActiveIndexChange={(swiper) => handleGameTypeChange(swiper.realIndex)}
      >
        {games.map((game) => (
          <SwiperSlide key={game.gameType}>
            <div className="flex justify-center items-center">
              <img src={game.image.src} alt="" className="h-32 object-cover" />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <button
        className="absolute h-full top-0 left-20 z-10"
        onClick={() => swiperRef.current?.slidePrev()}
      >
        <img src={GreenArrow.src} className="rotate-180" alt="" />
      </button>

      <button
        className="absolute h-full top-0 right-20 z-10"
        onClick={() => swiperRef.current?.slideNext()}
      >
        <img src={GreenArrow.src} alt="" />
      </button>
    </div>
  );
};

export default GameTypeSwiper;
