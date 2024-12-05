"use client";

import React from "react";
import useFrogMahjongStore from "@/utils/stores/frog-mahjong/useFrogMahjongStore";
import { useTranslations } from "next-intl";
import {
  bodyParts,
  colorParts,
} from "@/utils/functions/frog-mahjong/checkMissions";

const HelpModal = () => {
  const m = useTranslations("HelpModal");
  const setIsHelpModal = useFrogMahjongStore((s) => s.setIsHelpModalOpen);

  return (
    <div className="fixed left-0 top-0 w-full h-full bg-black/50 p-2 z-30 flex justify-center items-center">
      <div className="max-w-xl w-full bg-white p-4 rounded-xl shadow-lg">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col justify-center items-center gap-2">
            <p className="w-full text-center bg-game-icon p-1 rounded font-bold text-white">
              {m("color")}
            </p>
            <div className="flex gap-2 flex-wrap justify-center">
              {colorParts.map((color) => (
                <div key={color} className={color}>
                  {color}
                </div>
              ))}
            </div>

            <p className="w-full text-center bg-game-icon p-1 rounded font-bold text-white mt-4">
              {m("body")}
            </p>
            <div className="flex gap-2 flex-wrap justify-center">
              {bodyParts.map((body) => (
                <div key={body} className={body}>
                  {body}
                </div>
              ))}
            </div>
          </div>
          <button
            className="w-full bg-match-button font-bold text-white py-1 rounded text-responsive-small disabled:bg-gray-200"
            onClick={() => setIsHelpModal(false)}
          >
            {m("close")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default HelpModal;
