"use client";

import React, { Dispatch, SetStateAction, useState } from "react";
import Quest from "@/public/icons/quest.png";

type TutorialProps = {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
};

const Tutorial = ({ setIsOpen }: TutorialProps) => {
  return (
    <div className="fixed top-0 left-0 bg-black/50 w-full h-full z-30 flex justify-center items-center">
      <div className="p-4 bg-white rounded-lg shadow-lg flex flex-col gap-4">
        <h2 className="text-3xl font-bold">Tutorial</h2>

        <div>
          <p>TutorialTutorialTutorial</p>
          <p>TutorialTutorialTutorial</p>
          <p>TutorialTutorialTutorial</p>
          <p>TutorialTutorialTutorial</p>
          <p>TutorialTutorialTutorial</p>
          <p>TutorialTutorialTutorial</p>
        </div>

        <button
          onClick={() => setIsOpen(false)}
          className="bg-red-400 px-2 py-1 rounded font-bold text-white disabled:bg-gray-200"
        >
          확인
        </button>
      </div>
    </div>
  );
};

export default Tutorial;
