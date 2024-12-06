"use client";

import React, { useState } from "react";
import { MdOutlineQuestionMark } from "react-icons/md";

const Tutorial = () => {
  const [isOpen, setIsOpen] = useState(false);

  const onClick = () => {
    setIsOpen(false);
  };

  return (
    <>
      {isOpen && (
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
              onClick={onClick}
              className="bg-red-400 px-2 py-1 rounded font-bold text-white disabled:bg-gray-200"
            >
              확인
            </button>
          </div>
        </div>
      )}

      <button className="absolute top-0 right-8 p-2">
        <MdOutlineQuestionMark size={24} />
      </button>
    </>
  );
};

export default Tutorial;
