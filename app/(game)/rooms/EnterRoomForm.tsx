"use client";

import axiosInstance, { Room } from "@/utils/axios";
import { SubmitHandler, useForm } from "react-hook-form";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { getCookie } from "cookies-next";

type EnterRoomFormProps = {
  room: Room;
};

type EnterRoomInputs = {
  password: string;
  roomID: number;
};

type RequestType = {
  password?: string;
  roomID: number;
};

const EnterRoomForm = ({ room }: EnterRoomFormProps) => {
  const router = useRouter();
  const accessToken = getCookie("accessToken");
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EnterRoomInputs>({
    defaultValues: {
      password: "",
      roomID: room.id,
    },
  });

  const onSubmit: SubmitHandler<EnterRoomInputs> = async (inputs) => {
    setIsLoading(true);

    try {
      const requestData: RequestType = {
        password: inputs.password,
        roomID: inputs.roomID,
      };

      // 만약 password가 빈 문자열이면 해당 키를 제거
      if (requestData.password === "") {
        delete requestData.password;
      }

      await axiosInstance.post("/v0.1/rooms/join", requestData, {
        headers: {
          tkn: getCookie("accessToken"),
        },
      });
      router.push(`/rooms/${room.id}`);
    } catch (e) {
      setIsError(true);
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      className="flex flex-col gap-8 py-4 rounded-xl"
      onSubmit={handleSubmit(onSubmit)}
    >
      <p className="font-bold text-xl">{room.name}</p>

      <div className="flex flex-col">
        <label>비밀번호</label>
        <input
          type="password"
          className={`border border-gray-400 rounded p-2 mt-3 ${
            errors.password && "border-red-400"
          }`}
          {...register("password")}
        />
      </div>

      {isError && (
        <p className="text-sm text-red-400 text-center">
          비밀번호가 일치하지 않습니다
        </p>
      )}

      <button
        type="submit"
        className="w-full bg-sky-500 rounded-lg py-3 text-white font-bold disabled:bg-gray-400"
        disabled={isLoading}
      >
        입장
      </button>
    </form>
  );
};

export default EnterRoomForm;
