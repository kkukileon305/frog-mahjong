"use client";

import CancelMatchBtn from "@/app/(game)/rooms/CancelMatchBtn";
import { useTranslations } from "next-intl";
import useOldFrogMahjong, {
  MatchingMode,
} from "@/utils/hooks/old-frog-mahjong/useOldFrogMahjong";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import useOldFrogMahjongStore from "@/utils/stores/old-frog-mahjong/useOldFrogMahjongStore";
import { SubmitHandler, useForm } from "react-hook-form";
import axiosInstance from "@/utils/axios";
import { getCookie } from "cookies-next";
import useMatchSettingStore from "@/utils/stores/useMatchSettingStore";
import useBlockScroll from "@/utils/hooks/useBlockScroll";
import frogPink from "@/public/icons/frog_pink.png";
import frogYellow from "@/public/icons/frog_yellow.png";
import useFrogMahjong from "@/utils/hooks/frog-mahjong/useFrogMahjong";
import useFrogMahjongStore from "@/utils/stores/frog-mahjong/useFrogMahjongStore";

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

  const oldConnect = useOldFrogMahjong(mode);
  const { oldPassword, oldIsMatching, oldIsMatchingCompleted } =
    useOldFrogMahjongStore((s) => ({
      oldPassword: s.gameState?.gameInfo?.password,
      oldIsMatching: s.isMatching,
      oldIsMatchingCompleted: s.isMatchingCompleted,
    }));

  const frogMahjongConnect = useFrogMahjong(mode);
  const { password, isMatching, isMatchingCompleted, setMode } =
    useFrogMahjongStore((s) => ({
      password: s.gameState?.gameInfo?.password,
      isMatching: s.isMatching,
      isMatchingCompleted: s.isMatchingCompleted,
      setMode: s.setMode,
    }));

  const { setPassword, gameType } = useMatchSettingStore((s) => ({
    setPassword: s.setPassword,
    gameType: s.gameType,
  }));

  useEffect(() => {
    setMode(mode);

    if (mode === "ENTER") return;

    (async () => {
      try {
        await axiosInstance.get(`/v0.1/users/${userID}`, {
          headers: {
            tkn: accessToken,
          },
        });

        if (gameType === "FROG_MAHJONG_OLD") {
          oldConnect();
        } else if (gameType === "FROG_MAHJONG") {
          frogMahjongConnect();
        }
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

        if (gameType === "FROG_MAHJONG_OLD") {
          oldConnect();
        } else if (gameType === "FROG_MAHJONG") {
          frogMahjongConnect();
        }
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
    if (gameType === "FROG_MAHJONG_OLD") {
      if (oldPassword) {
        try {
          await navigator.clipboard.writeText(oldPassword);

          setIsCopySuccess(true);
        } catch (e) {
          console.log(e);
          setIsCopySuccess(false);
        }
      }
    } else if (gameType === "FROG_MAHJONG") {
      if (password) {
        try {
          await navigator.clipboard.writeText(password);

          setIsCopySuccess(true);
        } catch (e) {
          console.log(e);
          setIsCopySuccess(false);
        }
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
                  {gameType === "FROG_MAHJONG_OLD" &&
                    m(oldIsMatchingCompleted ? "complete" : "search")}
                  {gameType === "FROG_MAHJONG" &&
                    m(isMatchingCompleted ? "complete" : "search")}
                </p>
              )}

              {mode === "CREATE" && (
                <>
                  <p className="text-center text-3xl font-bold">
                    {gameType === "FROG_MAHJONG_OLD" &&
                      m(oldIsMatchingCompleted ? "complete" : "send")}
                    {gameType === "FROG_MAHJONG" &&
                      m(isMatchingCompleted ? "complete" : "send")}
                  </p>
                  <div className="w-full flex items-center justify-center gap-4">
                    <p className="w-[calc(100%-136px)] font-bold text-xl text-white bg-game-icon p-2 rounded-xl max-w-64 text-center">
                      {gameType === "FROG_MAHJONG_OLD" &&
                        (oldPassword ? oldPassword : m("loading"))}{" "}
                      {gameType === "FROG_MAHJONG" &&
                        (password ? password : m("loading"))}
                    </p>
                    <button
                      onClick={onClick}
                      className="w-[110px] bg-yellow-button font-bold text-white py-2 px-4 text-xl rounded-xl"
                    >
                      {m(isCopySuccess ? "copySuccess" : "copy")}
                    </button>
                  </div>
                </>
              )}

              {mode === "ENTER" && (
                <>
                  <p className="text-center text-3xl font-bold">
                    {gameType === "FROG_MAHJONG_OLD" &&
                      m(oldIsMatchingCompleted ? "complete" : "write")}
                    {gameType === "FROG_MAHJONG" &&
                      m(isMatchingCompleted ? "complete" : "write")}
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
                      disabled={
                        oldIsMatchingCompleted ||
                        oldIsMatching ||
                        isLoading ||
                        isMatchingCompleted ||
                        isMatching
                      }
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
