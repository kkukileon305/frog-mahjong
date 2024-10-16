"use client";

import CancelMatchBtn from "@/app/(game)/rooms/CancelMatchBtn";
import { useTranslations } from "next-intl";
import useQuickMatching, { MatchingMode } from "@/utils/hooks/useQuickMatching";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import useGameStore from "@/utils/stores/useGameStore";
import { SubmitHandler, useForm } from "react-hook-form";
import axiosInstance from "@/utils/axios";
import { getCookie } from "cookies-next";
import useMatchSettingStore from "@/utils/stores/useMatchSettingStore";
import useBlockScroll from "@/utils/hooks/useBlockScroll";
import frogPink from "@/public/icons/frog_pink.png";
import frogYellow from "@/public/icons/frog_yellow.png";
import Image from "next/image";

type CancelMatchBtnProps = {
  mode: MatchingMode;
  setOpenMatchModal: Dispatch<SetStateAction<MatchingMode | null>>;
};

type Inputs = {
  inputPassword: string;
};

const MatchingModal = ({ mode, setOpenMatchModal }: CancelMatchBtnProps) => {
  const m = useTranslations("MatchingModal");

  const [error, setError] = useState<null | string>(null);

  const accessToken = getCookie("accessToken") as string;
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordError, setIsPasswordError] = useState(false);
  const [isCopySuccess, setIsCopySuccess] = useState(false);

  const userID = getCookie("userID") as string;

  const {
    handleSubmit,
    formState: { errors },
    register,
    watch,
  } = useForm<Inputs>({
    defaultValues: {
      inputPassword: "",
    },
  });

  const connect = useQuickMatching(mode);
  const { password, isMatching, isMatchingCompleted } = useGameStore((s) => ({
    password: s.gameState?.gameInfo?.password,
    isMatching: s.isMatching,
    isMatchingCompleted: s.isMatchingCompleted,
  }));
  const setPassword = useMatchSettingStore((s) => s.setPassword);

  useEffect(() => {
    if (mode === "ENTER") return;

    (async () => {
      try {
        await axiosInstance.get(`/v0.1/users/${userID}`, {
          headers: {
            tkn: accessToken,
          },
        });

        connect();
      } catch (e) {
        setError(JSON.stringify(e));
        console.log(e);
      }
    })();
  }, []);

  useBlockScroll();

  const onSubmit: SubmitHandler<Inputs> = async (inputs) => {
    if (mode === "ENTER") {
      setIsLoading(true);
      try {
        await axiosInstance.get(
          `/v0.1/rooms/join/play?password=${inputs.inputPassword}`,
          {
            headers: {
              tkn: accessToken,
            },
          }
        );

        connect();
      } catch (e) {
        setIsPasswordError(true);
        return;
      } finally {
        setIsLoading(false);
      }
    }
  };

  watch((inputs) => {
    inputs.inputPassword && setPassword(inputs.inputPassword);
  });

  const onClick = async () => {
    if (password) {
      try {
        await navigator.clipboard.writeText(password);

        setIsCopySuccess(true);
      } catch (e) {
        console.log(e);
        setIsCopySuccess(false);
      }
    }
  };

  return (
    <div className="absolute left-0 top-0 w-full h-[calc(100dvh)] bg-black/50 z-30 flex justify-center items-center p-2">
      <div className="relative max-w-3xl w-full max-h-[calc(100dvh-16px)] overflow-y-auto py-8 px-4 shadow bg-game-icon rounded-xl">
        <div className="flex items-center justify-center gap-4">
          <img
            src={frogPink.src}
            alt="icon"
            width={66}
            height={74}
            className="translate-y-2"
          />
          <h3 className="font-bold text-white text-center text-4xl">
            {m(mode)}
          </h3>
          <img
            src={frogYellow.src}
            alt="icon"
            width={66}
            height={74}
            className="translate-y-2"
          />
        </div>
        <div className="relative min-h-[236px] bg-white flex flex-col justify-center items-center gap-8 rounded-xl py-8 px-2">
          {!error ? (
            <>
              {mode === "NORMAL" && (
                <p className="text-center text-3xl font-bold">
                  {m(isMatchingCompleted ? "complete" : "search")}
                </p>
              )}

              {mode === "CREATE" && (
                <>
                  <p className="text-center text-3xl font-bold">
                    {m(isMatchingCompleted ? "complete" : "send")}
                  </p>
                  <div className="w-full flex items-center justify-center gap-4">
                    <p className="font-bold text-xl text-white bg-game-icon p-2 rounded-xl w-full max-w-64 text-center">
                      {password ? password : m("loading")}
                    </p>
                    <button
                      onClick={onClick}
                      className="bg-yellow-button font-bold text-white py-2 px-4 text-xl rounded-xl"
                    >
                      {m(isCopySuccess ? "copySuccess" : "copy")}
                    </button>
                  </div>
                </>
              )}

              {mode === "ENTER" && (
                <>
                  <p className="text-center text-3xl font-bold">
                    {m(isMatchingCompleted ? "complete" : "write")}
                  </p>

                  <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex items-center gap-4"
                  >
                    <div className="flex flex-col">
                      <input
                        type="text"
                        className={`border border-gray-400 rounded p-2 ${
                          errors.inputPassword && "border-red-400"
                        }`}
                        {...register("inputPassword", {
                          required: m("writePassword"),
                        })}
                      />
                    </div>

                    <button
                      disabled={isMatchingCompleted || isMatching || isLoading}
                      className="bg-amber-500 font-bold text-white py-2 px-4 text-xl rounded-xl disabled:bg-gray-400"
                    >
                      {m("enter")}
                    </button>
                  </form>

                  {errors.inputPassword && (
                    <span className="text-sm text-red-400 mt-2">
                      {errors.inputPassword.message}
                    </span>
                  )}

                  {isPasswordError && (
                    <span className="text-sm text-red-400 mt-2">
                      {m("notFound")}
                    </span>
                  )}
                </>
              )}
            </>
          ) : (
            <p className="text-center text-xs font-bold">
              {m("error")}
              {JSON.stringify(error)}
            </p>
          )}
        </div>
        <CancelMatchBtn setOpenMatchModal={setOpenMatchModal} />
      </div>
    </div>
  );
};

export default MatchingModal;
