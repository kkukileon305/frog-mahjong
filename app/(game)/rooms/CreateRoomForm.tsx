"use client";

import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import { useState } from "react";
import axiosInstance, {
  FormMetadata,
  RoomCreatedResponse,
} from "@/utils/axios";
import { getCookie } from "cookies-next";
import { useTranslations } from "next-intl";

type CreateRoomInputs = {
  name: string;
  minCount: string;
  maxCount: string;
  password?: string;
  timer: string;
};

type RequestType = {
  name: string;
  minCount: number;
  maxCount: number;
  password?: string;
  timer: number;
};

const CreateRoomForm = ({ formMetadata }: { formMetadata: FormMetadata }) => {
  const m = useTranslations("CreateRoomForm");

  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<CreateRoomInputs>({
    defaultValues: {
      name: "",
      maxCount: "4",
      minCount: "2",
      password: "",
      timer: formMetadata.timers[0].toString(),
    },
  });

  const [isLoading, setIsLoading] = useState(false);

  const [isStable, setIsStable] = useState(true);

  watch((values) => {
    const min = Number(values.minCount);
    const max = Number(values.maxCount);

    setIsStable(min <= max);
  });

  const onSubmit: SubmitHandler<CreateRoomInputs> = async (inputs) => {
    if (isStable) {
      setIsLoading(true);

      try {
        const requestData: RequestType = {
          maxCount: Number(inputs.maxCount),
          minCount: Number(inputs.minCount),
          name: inputs.name,
          password: inputs.password,
          timer: Number(inputs.timer),
        };

        // 만약 password가 빈 문자열이면 해당 키를 제거
        if (requestData.password === "") {
          delete requestData.password;
        }

        const { data } = await axiosInstance.post<RoomCreatedResponse>(
          "/v0.1/rooms/create",
          requestData,
          {
            headers: {
              tkn: getCookie("accessToken"),
            },
          }
        );

        router.refresh();

        const roomUrl = `/rooms/${data.roomID}${
          requestData.password ? `?password=${requestData.password}` : ""
        }`;
        router.push(roomUrl);
      } catch (e) {
        console.log(e);
        setIsLoading(false);
      }
    }
  };

  return (
    <form
      className="flex flex-col gap-8 py-4 rounded-xl"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex flex-col">
        <label>{m("roomName")}</label>
        <input
          type="name"
          className={`border border-gray-400 rounded p-2 mt-3 ${
            errors.name && "border-red-400"
          }`}
          {...register("name", {
            required: m("writeRoomName"),
          })}
        />
        {errors.name && (
          <span className="text-sm text-red-400 mt-2">
            {errors.name.message}
          </span>
        )}
      </div>
      <div className="flex flex-col">
        <label>{m("minPlayerNumber")}</label>

        <div className="flex justify-between gap-2 mt-3">
          {["2", "3", "4"].map((i) => (
            <label
              key={i}
              className={`w-1/3 rounded border flex justify-center cursor-pointer py-2 ${
                watch("minCount") === i &&
                "border-blue-400 font-bold text-blue-400"
              }`}
            >
              <input type="radio" value={i} {...register("minCount")} hidden />
              {i}
            </label>
          ))}
        </div>
      </div>
      <div className="flex flex-col">
        <label>{m("maxPlayerNumber")}</label>
        <div className="flex justify-between gap-2 mt-3">
          {["2", "3", "4"].map((i) => (
            <label
              key={i}
              className={`w-1/3 rounded border flex justify-center cursor-pointer py-2 ${
                watch("maxCount") === i &&
                "border-blue-400 font-bold text-blue-400"
              }`}
            >
              <input type="radio" value={i} {...register("maxCount")} hidden />
              {i}
            </label>
          ))}
        </div>
      </div>

      {!isStable && (
        <span className="text-sm text-red-400 mt-2">{m("stablePlayer")}</span>
      )}

      <div className="flex flex-col">
        <label>{m("timeout")}</label>
        <div className="flex justify-between gap-2 mt-3">
          {formMetadata.timers.map((i) => (
            <label
              key={i}
              className={`w-1/3 rounded border flex justify-center cursor-pointer py-2 ${
                watch("timer") === i.toString() &&
                "border-blue-400 font-bold text-blue-400"
              }`}
            >
              <input type="radio" value={i} {...register("timer")} hidden />
              {i}
            </label>
          ))}
        </div>
      </div>

      <div className="flex flex-col">
        <label>{m("roomPassword")}</label>
        <input
          type="password"
          className={`border border-gray-400 rounded p-2 mt-3 ${
            errors.password && "border-red-400"
          }`}
          {...register("password")}
        />
        {errors.password && (
          <span className="text-sm text-red-400 mt-2">
            {errors.password.message}
          </span>
        )}
      </div>
      <div className="flex flex-col-reverse md:flex-row gap-4">
        <button
          type="button"
          className="w-full bg-white border border-gray-400 flex justify-center items-center rounded-lg py-3 font-bold cursor-pointer"
          id="back"
          disabled={isLoading}
        >
          {m("close")}
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-sky-500 rounded-lg py-3 text-white font-bold disabled:bg-gray-400"
        >
          {m("createRoom")}
        </button>
      </div>
    </form>
  );
};

export default CreateRoomForm;
