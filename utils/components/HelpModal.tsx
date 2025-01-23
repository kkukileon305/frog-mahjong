"use client";

import { StaticImageData } from "next/image";
import React, { useState } from "react";

export type HelpContent = {
  title: string;
  image?: StaticImageData;
  slides?: {
    subTitle: string;
    image: StaticImageData;
  }[];
};

const HelpModal = ({ helpContents }: { helpContents: HelpContent[] }) => {
  const [pageIndex, setPageIndex] = useState(0);

  return (
    <div className="p-2 flex justify-center items-center z-30 fixed left-0 top-0 bg-black/65 w-full h-full">
      <div className="max-w-3xl w-full bg-white p-2 rounded-[5px] shadow-lg">
        <div className="w-full">{helpContents[pageIndex].title}</div>

        <div className="flex gap-2 justify-center font-bold text-red-400">
          {helpContents.map((h, index) => (
            <button
              onClick={() => setPageIndex(index)}
              key={h.title}
              className={`w-32 border-2 rounded-xl py-2 border-red-400 ${
                index === pageIndex && "bg-red-400 text-white"
              }`}
            >
              {h.title}
            </button>
          ))}
        </div>

        <button
          id="back"
          className="w-full bg-sky-500 rounded-lg py-3 text-white font-bold disabled:bg-gray-400"
        >
          close
        </button>
      </div>
    </div>
  );
};

export default HelpModal;
