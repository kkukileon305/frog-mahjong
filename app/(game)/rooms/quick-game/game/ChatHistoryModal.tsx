"use client";

import { useTranslations } from "next-intl";
import useGameStore from "@/utils/stores/useGameStore";

const ChatHistoryModal = () => {
  const m = useTranslations("ChatHistoryModal");
  const chatList = useGameStore((s) => s.chatList);

  return (
    <div className="flex flex-col gap-4">
      <ul className="w-full border border-white overflow-y-auto max-h-[calc(72px*6)] md:max-h-[calc(72px*10)]">
        {chatList.toReversed().map((item) => (
          <li key={item.chatID} className="text-xl p-2 text-white mb-2">
            <div className="flex">
              <p>{item.name}</p>
            </div>
            <p className="break-words">{item.message}</p>
          </li>
        ))}
      </ul>

      <button
        id="back"
        className="w-full bg-sky-500/50 rounded-lg py-3 text-white font-bold disabled:bg-gray-400"
      >
        {m("close")}
      </button>
    </div>
  );
};

export default ChatHistoryModal;
