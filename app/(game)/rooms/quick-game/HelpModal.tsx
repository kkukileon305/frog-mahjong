"use client";

import React, { useState } from "react";
import HelpImage1 from "@/public/helps/setsumei1.jpg";
import HelpImage2 from "@/public/helps/setsumei2.jpg";
import Image from "next/image";
import { useTranslations } from "next-intl";

const HelpModal = () => {
  const m = useTranslations("HelpModal");

  const [isRotated, setIsRotated] = useState<boolean>(false);

  return (
    <div className="relative w-full flex flex-col gap-8">
      <div
        className={`overflow-hidden flip-card w-full h-full ${
          isRotated && "flip-card-rotate"
        }`}
      >
        <div className="flip-card-inner h-full aspect-[1.4/1]">
          <div className="flip-card-front absolute top-0">
            <img className="rounded-xl" src={HelpImage1.src} alt="HelpImage1" />
          </div>
          <div className="flip-card-back absolute top-0">
            <img className="rounded-xl" src={HelpImage2.src} alt="HelpImage2" />
          </div>
        </div>
      </div>

      <div className="flex gap-2 justify-center font-bold text-white">
        <button
          className={`w-32 border-2 rounded-xl py-2 border-red-400 ${
            !isRotated && "bg-red-400"
          }`}
          onClick={() => setIsRotated(false)}
        >
          {m("calRule")}
        </button>
        <button
          className={`w-32 border-2 rounded-xl py-2 border-red-400 ${
            isRotated && "bg-red-400"
          }`}
          onClick={() => setIsRotated(true)}
        >
          {m("cardsInfo")}
        </button>
      </div>

      <button
        id="back"
        className="w-full bg-sky-500 rounded-lg py-3 text-white font-bold disabled:bg-gray-400"
      >
        {m("close")}
      </button>
    </div>
  );
};

export default HelpModal;
