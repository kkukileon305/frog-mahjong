"use client";

import React, { Dispatch, SetStateAction, useState } from "react";
import HelpImage1 from "@/public/helps/setsumei1.jpg";
import HelpImage2 from "@/public/helps/setsumei2.jpg";
import Image from "next/image";

const HelpModal = ({
  setIsHelpModal,
}: {
  setIsHelpModal: Dispatch<SetStateAction<boolean>>;
}) => {
  const [isRotated, setIsRotated] = useState<boolean>(false);

  return (
    <div className="absolute flex justify-center items-center w-full h-full left-0 top-0 bg-black/50 z-10">
      <div className="h-[800px] relative bg-white/50 max-w-3xl w-full rounded-xl p-8 flex flex-col gap-8">
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
          onClick={() => setIsHelpModal(false)}
          className="w-full bg-sky-500 rounded-lg py-3 text-white font-bold disabled:bg-gray-400"
        >
          닫기
        </button>
      </div>
    </div>
  );
};

export default HelpModal;
