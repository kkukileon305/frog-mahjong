"use client";

import React, { useState } from "react";
import useFrogMahjongStore from "@/utils/stores/frog-mahjong/useFrogMahjongStore";
import { useTranslations } from "next-intl";
import HelpImage from "@/public/helps/help.jpg";

const HelpModal = () => {
  const m = useTranslations("HelpModal");
  const setIsHelpModal = useFrogMahjongStore((s) => s.setIsHelpModalOpen);

  return (
    <div className="fixed left-0 top-0 w-full h-full bg-black/50 p-2 z-30 flex justify-center items-center">
      <div className="max-w-xl w-full h-full overflow-hidden bg-white rounded-xl shadow-lg">
        <div
          className="h-full flex flex-col"
          onClick={() => setIsHelpModal(false)}
        >
          <img className="w-full h-full" src={HelpImage.src} alt="" />
        </div>
      </div>
    </div>
  );
};

export default HelpModal;
