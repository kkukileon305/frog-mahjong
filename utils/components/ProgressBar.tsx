import RouletteLoading from "@/public/effects/roulette_loading.gif";
import React from "react";
import TextLoading from "@/public/text/loading_text.png";

type ProgressBarProps = {
  progress: number;
};

const ProgressBar = ({ progress }: ProgressBarProps) => {
  return (
    <div>
      <div className="px-4">
        <img src={RouletteLoading.src} alt="loading image" />
      </div>
      <div className="relative w-full max-w-2xl mx-auto border-2 border-white bg-gray-400 rounded-full h-6 overflow-hidden">
        <div
          className="bg-white h-full rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />

        <span className="absolute inset-0 flex items-center justify-center text-gray-400 font-bold">
          {progress}%
        </span>
      </div>
      <div className="mt-2 w-full px-4">
        <img src={TextLoading.src} alt="loading asset text" />
      </div>
    </div>
  );
};

export default ProgressBar;
