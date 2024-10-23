"use client";

import { SubmitHandler, useForm } from "react-hook-form";
import { FaTelegramPlane } from "react-icons/fa";
import { BsList } from "react-icons/bs";
import { useEffect, useState } from "react";
import ModalContainer from "@/utils/components/ModalContainer";
import { useTranslations } from "next-intl";
import { getCookie } from "cookies-next";
import useFrogMahjongStore from "@/utils/stores/frog-mahjong/useFrogMahjongStore";

type Inputs = {
  message: string;
};

const ChatForm = () => {
  const m = useTranslations("ChatForm");
  const { gameState, roomID, ws } = useFrogMahjongStore((s) => ({
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
      {/*TODO:history modal*/}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex gap-2 w-full h-full bg-white/70 font-bold px-2 rounded-full overflow-hidden items-center"
      >
        <button onClick={() => setIsOpen(true)} type="button">
          <BsList size={24} className="text-game-icon" />
        </button>

        <input
          className="w-full h-fit text-xs lg:text-base placeholder:text-xs placeholder:lg:text-base placeholder:text-black/50 bg-transparent focus:outline-none"
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
