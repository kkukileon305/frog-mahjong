"use client";

import { SubmitHandler, useForm } from "react-hook-form";
import { FormMetadata } from "@/utils/axios";
import { useTranslations } from "next-intl";
import useMatchSettingStore from "@/utils/stores/useMatchSettingStore";
import { useEffect, useState } from "react";
import * as timers from "node:timers";
import useGameStore from "@/utils/stores/useGameStore";
import QuickMatchingBtn from "@/app/(game)/rooms/QuickMatchingBtn";
import CancelMatchBtn from "@/app/(game)/rooms/CancelMatchBtn";

type GameSettingFormProps = {
  formMetadata: FormMetadata;
};

type GameSettingInputs = {
  timer: string;
  count: string;
  password: string;
};

const MatchSettingForm = ({ formMetadata }: GameSettingFormProps) => {
  const m = useTranslations("CreateRoomForm");

  const [isWithFriends, setIsWithFriends] = useState(false);

  const {
    register, //
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<GameSettingInputs>({
    defaultValues: {
      timer: formMetadata.timers[0].toString(),
      count: String(2),
      password: "",
    },
  });

  const { count, setCount, timer, setTimer, setPassword } =
    useMatchSettingStore();
  const { isMatching, isMatchingCompleted } = useGameStore((s) => ({
    isMatching: s.isMatching,
    isMatchingCompleted: s.isMatchingCompleted,
  }));

  useEffect(() => {
    setCount(2);
    setTimer(formMetadata.timers[0]);
  }, []);

  watch((value) => {
    setCount(Number(value.count));
    setTimer(Number(value.timer));
    setPassword(value.password!);
  });

  if (isMatching || isMatchingCompleted) {
    return (
      <div className="h-[246px] mb-4 flex justify-center items-center flex-col">
        <p>{m("matching")}</p>
        <CancelMatchBtn />
      </div>
    );
  }

  return (
    <>
      <form
        onSubmit={(e) => e.preventDefault()}
        className="pb-4 flex flex-col gap-4"
      >
        <div className="flex gap-4">
          <button
            onClick={() => setIsWithFriends(false)}
            className={`w-full rounded border flex justify-center cursor-pointer py-2 ${
              !isWithFriends && "border-blue-400 font-bold text-blue-400"
            }`}
          >
            {m("random")}
          </button>

          <button
            onClick={() => setIsWithFriends(true)}
            className={`w-full rounded border flex justify-center cursor-pointer py-2 ${
              isWithFriends && "border-blue-400 font-bold text-blue-400"
            }`}
          >
            {m("with")}
          </button>
        </div>

        <>
          <div className="flex flex-col">
            <label>{m("timeout")}</label>
            <div className="flex justify-between gap-2 mt-3">
              {formMetadata.timers.map((i) => (
                <label
                  key={i}
                  className={`w-1/3 rounded border flex justify-center cursor-pointer py-2 ${
                    timer === i && "border-blue-400 font-bold text-blue-400"
                  }`}
                >
                  <input type="radio" value={i} {...register("timer")} hidden />
                  {i}
                </label>
              ))}
            </div>
          </div>

          <div className="flex flex-col mb-4">
            <label>{m("maxPlayerNumber")}</label>
            <div className="flex justify-between gap-2 mt-3">
              {["2", "3", "4"].map((i) => (
                <label
                  key={i}
                  className={`w-1/3 rounded border flex justify-center cursor-pointer py-2 ${
                    count.toString() === i &&
                    "border-blue-400 font-bold text-blue-400"
                  }`}
                >
                  <input type="radio" value={i} {...register("count")} hidden />
                  {i}
                </label>
              ))}
            </div>
          </div>

          {!isWithFriends && <QuickMatchingBtn />}
          {isWithFriends && <QuickMatchingBtn mode="CREATE" />}

          <div className="flex relative my-4 items-center">
            <div className="basis-2/5 h-[1px] bg-gray-400" />
            <p className="basis-1/5 px-2 text-center">{m("or")}</p>
            <div className="basis-2/5 h-[1px] bg-gray-400" />
          </div>

          <div className="flex flex-col mb-4">
            <label>{m("password")}</label>
            <input
              type="password"
              className={`border border-gray-400 rounded p-2 mt-3 ${
                errors.password && "border-red-400"
              }`}
              {...register("password", {
                required: m("writePassword"),
              })}
            />
            {errors.password && (
              <span className="text-sm text-red-400 mt-2">
                {errors.password.message}
              </span>
            )}
          </div>

          <QuickMatchingBtn mode="ENTER" />
        </>
      </form>
    </>
  );
};

export default MatchSettingForm;
