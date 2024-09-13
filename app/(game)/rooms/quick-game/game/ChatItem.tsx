"use client";

import { motion } from "framer-motion";
import { ChatResponse } from "@/utils/constants/socketTypes";

type ChatItemProps = {
  chat: ChatResponse;
  place?: "left" | "right";
};

const ChatItem = ({ chat, place }: ChatItemProps) => {
  return (
    <motion.li
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 100, height: "fit-content" }}
      exit={{ opacity: 0, height: 0 }}
      className={`overflow-y-hidden flex drop-shadow-lg ${
        place === "right" && "flex-row-reverse"
      }`}
    >
      <div
        className={`translate-y-2 w-0 h-0 border-l-[10px] border-t-[5px] border-t-transparent border-b-[5px] border-b-transparent border-r-[10px]
        ${
          place === "left"
            ? "border-l-transparent border-r-white"
            : "border-l-white border-r-transparent"
        }
      `}
      />
      <div className="w-[calc(100%-20px)] rounded bg-white mb-2 p-2">
        <p className="w-full break-words whitespace-pre-line font-bold">
          {chat.message}
          {process.env.NODE_ENV === "development" && (
            <p className="absolute">{chat.chatID}</p>
          )}
        </p>
      </div>
    </motion.li>
  );
};

export default ChatItem;
