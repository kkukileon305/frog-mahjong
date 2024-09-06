"use client";

import React, { useState } from "react";
import HelpImage1 from "@/public/helps/setsumei1.jpg";
import HelpImage2 from "@/public/helps/setsumei2.jpg";
import Image from "next/image";

const HelpModal = () => {
  const [isRotated, setIsRotated] = useState<boolean>(false);

  return (
    <div className="relative w-full h-[800px] flex flex-col gap-8">
      <div
        className={`overflow-hidden drop-shadow-xl flip-card w-full h-full ${
          isRotated && "flip-card-rotate"
        }`}
      >
        <div className="flip-card-inner w-full h-full">
          <div className="flip-card-front absolute top-0">
            <Image
              className="rounded-xl"
              src={HelpImage1.src}
              alt="HelpImage1"
              width={1576}
              height={1282}
            />
          </div>
          <div className="flip-card-back absolute top-0">
            <Image
              className="rounded-xl"
              src={HelpImage2.src}
              alt="HelpImage2"
              width={1576}
              height={1282}
            />
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
          점수계산 규칙
        </button>
        <button
          className={`w-32 border-2 rounded-xl py-2 border-red-400 ${
            isRotated && "bg-red-400"
          }`}
          onClick={() => setIsRotated(true)}
        >
          패의 구성
        </button>
      </div>

      <button
        id="back"
        className="w-full bg-sky-500 rounded-lg py-3 text-white font-bold disabled:bg-gray-400"
      >
        닫기
      </button>
    </div>
  );
};

export default HelpModal;
