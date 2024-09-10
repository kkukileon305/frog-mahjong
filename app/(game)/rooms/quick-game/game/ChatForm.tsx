"use client";

import { SubmitHandler, useForm } from "react-hook-form";
import { GameInfo, UserSocket } from "@/utils/constants/socketTypes";
import { FaTelegramPlane } from "react-icons/fa";
import { BsList } from "react-icons/bs";
import { useEffect, useState } from "react";
import ChatHistoryModal from "@/app/(game)/rooms/quick-game/game/ChatHistoryModal";
import ModalContainer from "@/utils/components/ModalContainer";
import { useTranslations } from "next-intl";

type ChatFormProps = {
  ws: WebSocket | null;
  roomID: number;
  currentUser: UserSocket;
  gameInfo: GameInfo | null;
};

type Inputs = {
  message: string;
};

const ChatForm = ({ roomID, ws, currentUser, gameInfo }: ChatFormProps) => {
  const m = useTranslations("ChatForm");

  const { register, reset, handleSubmit } = useForm<Inputs>();
  const [isOpen, setIsOpen] = useState(false);

  const onSubmit: SubmitHandler<Inputs> = (inputs) => {
    const request = {
      userID: currentUser.id,
      roomID: Number(roomID),
      event: "CHAT",
      message: inputs.message,
      name: currentUser.name,
    };

    ws?.send(JSON.stringify(request));
    reset();
  };

  useEffect(() => {
    setIsOpen(false);
  }, [gameInfo]);

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
          <BsList size={24} className="text-green-700" />
        </button>

        <input
          className="w-full h-full placeholder:text-black/50 bg-transparent focus:outline-none"
          {...register("message", {
            required: m("writeChat"),
          })}
          placeholder={`${m("placeholder")}`}
        />

        <button type="submit">
          <FaTelegramPlane size={24} className="text-green-700" />
        </button>
      </form>
    </>
  );
};

export default ChatForm;
