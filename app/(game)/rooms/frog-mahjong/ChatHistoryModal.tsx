"use client";

import { useTranslations } from "next-intl";
import useFrogMahjongStore from "@/utils/stores/frog-mahjong/useFrogMahjongStore";

const ChatHistoryModal = () => {
  const m = useTranslations("ChatHistoryModal");
  const chatList = useFrogMahjongStore((s) => s.chatList);

  return (
    <div className="flex flex-col h-full gap-4">
      <ul className="w-full border border-white overflow-y-auto h-[calc(100dvh-120px)]">
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
