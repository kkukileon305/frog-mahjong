"use client";

import { SubmitHandler, useForm } from "react-hook-form";
import { FormMetadata } from "@/utils/axios";
import { useTranslations } from "next-intl";
import useMatchSettingStore from "@/utils/stores/useMatchSettingStore";
import { useEffect } from "react";
import * as timers from "node:timers";
import useGameStore from "@/utils/stores/useGameStore";

type GameSettingFormProps = {
  formMetadata: FormMetadata;
};

type GameSettingInputs = {
  timer: string;
  count: string;
};

const MatchSettingForm = ({ formMetadata }: GameSettingFormProps) => {
  const m = useTranslations("CreateRoomForm");

  const {
    register, //
    watch,
    handleSubmit,
  } = useForm<GameSettingInputs>({
    defaultValues: {
      timer: formMetadata.timers[0].toString(),
      count: String(2),
    },
  });

  const { count, setCount, timer, setTimer } = useMatchSettingStore();
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
  });

  if (isMatching || isMatchingCompleted) {
    return (
      <div className="h-[188px] flex justify-center items-center">
        {m("matching")}
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="pb-4 flex flex-col gap-4"
    >
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

      <div className="flex flex-col">
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
    </form>
  );
};

export default MatchSettingForm;
