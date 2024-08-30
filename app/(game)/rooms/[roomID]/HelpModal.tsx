"use client";

import React, { Dispatch, SetStateAction } from "react";

const HelpModal = ({
  setIsHelpModal,
}: {
  setIsHelpModal: Dispatch<SetStateAction<boolean>>;
}) => {
  return (
    <div className="absolute flex justify-center items-center w-full h-full left-0 top-0 bg-black/50 z-10">
      <div className="bg-white max-w-3xl w-full rounded-xl p-8 flex flex-col gap-8">
        <p className="text-center">설명서 준비중</p>
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
