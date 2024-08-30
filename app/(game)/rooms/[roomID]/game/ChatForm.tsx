"use client";

import { SubmitHandler, useForm } from "react-hook-form";
import { UserSocket } from "@/utils/socketTypes";

type ChatFormProps = {
  ws: WebSocket | null;
  roomID: string;
  currentUser: UserSocket;
};

type Inputs = {
  message: string;
};

const ChatForm = ({ roomID, ws, currentUser }: ChatFormProps) => {
  const { register, reset, handleSubmit } = useForm<Inputs>();

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

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full h-full">
      <input
        className="w-full h-full bg-green-800 text-white placeholder:text-white/50 px-2"
        {...register("message", {
          required: "메세지를 입력해주세요...",
        })}
        placeholder="채팅을 입력하세요"
      />
    </form>
  );
};

export default ChatForm;
