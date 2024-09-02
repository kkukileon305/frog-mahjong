"use client";

import React, { Dispatch, SetStateAction } from "react";

type ChatHistoryModalProps = {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
};

const ChatHistoryModal = ({ setIsOpen }: ChatHistoryModalProps) => {
  return (
    <div className="absolute left-0 top-0 w-full h-full bg-black/50 flex justify-center items-center py-12">
      <div className="bg-black/50 max-w-3xl w-full rounded-xl p-8 h-full flex flex-col gap-4">
        <ul className="w-full border border-white overflow-y-auto h-[calc(100%-48px)]"></ul>

        <button
          onClick={() => setIsOpen(false)}
          className="w-full bg-sky-500/50 rounded-lg py-3 text-white font-bold disabled:bg-gray-400"
        >
          닫기
        </button>
      </div>
    </div>
  );
};

export default ChatHistoryModal;
