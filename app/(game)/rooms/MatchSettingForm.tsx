"use client";

import { SubmitHandler, useForm } from "react-hook-form";
import { FormMetadata } from "@/utils/axios";
import { useTranslations } from "next-intl";
import useMatchSettingStore from "@/utils/stores/useMatchSettingStore";
import { useEffect, useState } from "react";
import useGameStore from "@/utils/stores/useGameStore";
import EnterRoomModal from "@/app/(game)/rooms/EnterRoomModal";
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
      {openMatchModal && (
        <EnterRoomModal
          mode={openMatchModal}
          setOpenMatchModal={setOpenMatchModal}
        />
      )}

      <form
        onSubmit={(e) => e.preventDefault()}
        className="flex flex-col gap-8 my-8"
      >
        <>
          <div className="flex flex-col">
            <label className="text-center text-3xl font-bold">
              {m("timeout")}
            </label>
            <div className="flex justify-between gap-2 mt-3">
              {formMetadata.timers.map((i) => (
                <label
                  key={i}
                  className={`w-1/3 text-xl flex font-bold justify-center cursor-pointer py-2 ${
                    timer === i
                      ? "bg-button-selected text-white"
                      : "bg-white text-green-600"
                  }`}
                >
                  <input type="radio" value={i} {...register("timer")} hidden />
                  {i}s
                </label>
              ))}
            </div>
          </div>

          <div className="flex flex-col mb-4">
            <label className="text-center text-3xl font-bold">
              {m("maxPlayerNumber")}
            </label>
            <div className="flex justify-between gap-2 mt-3">
              {["2", "3", "4"].map((i) => (
                <label
                  key={i}
                  className={`w-1/3 text-xl flex font-bold justify-center cursor-pointer py-2 ${
                    count.toString() === i
                      ? "bg-button-selected text-white"
                      : "bg-white text-green-600"
                  }`}
                >
                  <input type="radio" value={i} {...register("count")} hidden />
                  {i}
                  {m("personCount")}
                </label>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-4 pt-4 md:px-8">
            <button
              onClick={() => setOpenMatchModal("NORMAL")}
              className="w-full bg-match-button font-bold text-white text-xl py-2 rounded"
            >
              {m("normal")}
            </button>
            <div className="flex gap-4">
              <button
                onClick={() => setOpenMatchModal("CREATE")}
                className="w-full bg-match-button font-bold text-white py-2 rounded text-xl"
              >
                {m("createRoom")}
              </button>

              <button
                onClick={() => setOpenMatchModal("ENTER")}
                className="w-full bg-match-button font-bold text-white py-2 rounded text-xl"
              >
                {m("enterRoom")}
              </button>
            </div>
          </div>
        </>
      </form>
    </>
  );
};

export default MatchSettingForm;
