"use client";

import { SubmitHandler, useForm } from "react-hook-form";
import { MutableRefObject } from "react";
import { JOINRequest } from "@/utils/socketTypes";

type ConnectInputs = {
  password: string;
};

type ConnectFormProps = {
  ws: WebSocket | null;
  roomId: string;
};

const ConnectForm = ({ ws, roomId }: ConnectFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ConnectInputs>({
    defaultValues: {
      password: "",
    },
  });

  const onSubmit: SubmitHandler<ConnectInputs> = async (inputs) => {
    const body: JOINRequest = {
      event: "JOIN",
      roomID: Number(roomId),
      message: inputs.password,
    };

    ws?.send(JSON.stringify(body));
  };

  return (
    <form
      className="flex flex-col gap-8 p-4 rounded-xl"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex flex-col">
        <label>비밀번호</label>
        <input
          type="password"
          className={`border border-gray-400 rounded p-2 mt-3 ${
            errors.password && "border-red-400"
          }`}
        />
        {errors.password && (
          <span className="text-sm text-red-400 mt-2">
            {errors.password.message}
          </span>
        )}
      </div>

      <button
        type="submit"
        className="w-full bg-sky-500 rounded-lg py-3 text-white font-bold disabled:bg-gray-400"
      >
        입장
      </button>
    </form>
  );
};

export default ConnectForm;
