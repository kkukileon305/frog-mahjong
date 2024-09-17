"use client";

import { SubmitHandler, useForm } from "react-hook-form";
import { GameInfo, UserSocket } from "@/utils/constants/socketTypes";
import { FaTelegramPlane } from "react-icons/fa";
import { BsList } from "react-icons/bs";
import { useEffect, useState } from "react";
import ChatHistoryModal from "@/app/(game)/rooms/quick-game/game/ChatHistoryModal";
import ModalContainer from "@/utils/components/ModalContainer";
import { useTranslations } from "next-intl";
import { getCookie } from "cookies-next";
import useGameStore from "@/utils/stores/useGameStore";

type Inputs = {
  message: string;
};

const ChatForm = () => {
  const m = useTranslations("ChatForm");
  const { gameState, roomID, ws } = useGameStore((s) => ({
    gameState: s.gameState,
    roomID: s.gameState?.gameInfo?.roomID,
    ws: s.ws,
  }));

  const userID = getCookie("userID") as string;
  const currentUser = gameState?.users?.find(
    (user) => user.id === Number(userID)
  );

  const { register, reset, handleSubmit } = useForm<Inputs>();
  const [isOpen, setIsOpen] = useState(false);

  const onSubmit: SubmitHandler<Inputs> = (inputs) => {
    const request = {
      userID: currentUser?.id!,
      roomID: Number(roomID),
      event: "CHAT",
      message: inputs.message,
      name: currentUser?.name,
    };

    ws?.send(JSON.stringify(request));
    reset();
  };

  useEffect(() => {
    setIsOpen(false);
  }, [gameState?.gameInfo]);

  return (
    <>
      {isOpen && (
        <ModalContainer setIsOpen={setIsOpen} isInGame>
          <ChatHistoryModal />
        </ModalContainer>
      )}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex gap-2 w-full h-full bg-white/70 font-bold px-2 rounded-full overflow-hidden"
      >
        <button onClick={() => setIsOpen(true)} type="button">
          <BsList size={24} className="text-game-icon" />
        </button>

        <input
          className="w-full h-full placeholder:text-black/50 bg-transparent focus:outline-none"
          {...register("message", {
            required: m("writeChat"),
          })}
          placeholder={`${m("placeholder")}`}
        />

        <button type="submit">
          <FaTelegramPlane size={24} className="text-game-icon" />
        </button>
      </form>
    </>
  );
};

export default ChatForm;
