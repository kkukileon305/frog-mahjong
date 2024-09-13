"use client";

import { SubmitHandler, useForm } from "react-hook-form";
import { FormMetadata } from "@/utils/axios";
import { useTranslations } from "next-intl";
import useMatchSettingStore from "@/utils/stores/useMatchSettingStore";
import { useEffect, useState } from "react";
import useGameStore from "@/utils/stores/useGameStore";
import MatchModalContainer from "@/app/(game)/rooms/MatchModalContainer";
import EnterRoomForm from "@/app/(game)/rooms/EnterRoomForm";
import { MatchingMode } from "@/utils/hooks/useQuickMatching";

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
  const [openMatchModal, setOpenMatchModal] = useState<null | MatchingMode>(
    null
  );

  const {
    register, //
    watch,
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

  return (
    <>
      {(isMatching || isMatchingCompleted) && <MatchModalContainer />}
      {openMatchModal && (
        <EnterRoomForm
          mode={openMatchModal}
          setOpenMatchModal={setOpenMatchModal}
        />
      )}

      <form
        onSubmit={(e) => e.preventDefault()}
        className="pb-4 flex flex-col gap-4"
      >
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

          <button
            onClick={() => setOpenMatchModal("NORMAL")}
            className="w-full bg-amber-500 font-bold text-white py-2 rounded"
          >
            {m("normal")}
          </button>
          <div className="flex gap-4">
            <button
              onClick={() => setOpenMatchModal("CREATE")}
              className="w-full bg-amber-500 font-bold text-white py-2 rounded"
            >
              {m("createRoom")}
            </button>

            <button
              onClick={() => setOpenMatchModal("ENTER")}
              className="w-full bg-amber-500 font-bold text-white py-2 rounded"
            >
              {m("enterRoom")}
            </button>
          </div>
        </>
      </form>
    </>
  );
};

export default MatchSettingForm;
