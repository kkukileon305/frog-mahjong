"use client";

import { StaticImageData } from "next/image";
import React, { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import GreenArrow from "@/public/icons/green_arrow.png";
import { Swiper as SwiperType } from "swiper";

export type HelpContent = {
  title: string;
  image?: StaticImageData;
  slides?: {
    subTitle: string;
    image: StaticImageData;
  }[];
};

const HelpModal = ({
  helpContents,
  setIsModalOpen,
}: {
  helpContents: HelpContent[];
  setIsModalOpen: (isOpen: boolean) => void;
}) => {
  const [pageIndex, setPageIndex] = useState(0);
  const swiperRef = useRef<SwiperType>();

  return (
    <div className="p-2 flex justify-center items-center z-30 fixed left-0 top-0 bg-black/65 w-full h-full">
      <div className="max-w-3xl w-full h-full bg-white p-2 rounded-[5px] shadow-lg flex flex-col gap-2">
        <div className="w-full h-[calc(100%-68px-16px)]">
          {helpContents[pageIndex].image && (
            <img
              src={helpContents[pageIndex].image.src}
              className="w-full h-full object-center object-contain"
              alt="help"
            />
          )}

          {helpContents[pageIndex].slides && (
            <div className="relative w-full h-full">
              <Swiper
                className="h-full my-2 flex bg-white/40 rounded-[3px]"
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
              >
                {helpContents[pageIndex].slides.map((subHelp) => (
                  <SwiperSlide key={subHelp.subTitle}>
                    <div className="flex h-full justify-center items-center">
                      <img
                        src={subHelp.image?.src}
                        alt=""
                        className="h-full object-cover"
                      />
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
          )}
        </div>

        <div className="flex gap-2 justify-center font-bold text-red-400">
          {helpContents.map((h, index) => (
            <button
              onClick={() => setPageIndex(index)}
              key={h.title}
              className={`w-32 border-2 rounded-xl py-1 border-red-400 ${
                index === pageIndex && "bg-red-400 text-white"
              }`}
            >
              {h.title}
            </button>
          ))}
        </div>

        <button
          id="back"
          onClick={() => setIsModalOpen(false)}
          className="w-full bg-sky-500 rounded-lg py-1 text-white font-bold disabled:bg-gray-400"
        >
          close
        </button>
      </div>
    </div>
  );
};

export default HelpModal;
