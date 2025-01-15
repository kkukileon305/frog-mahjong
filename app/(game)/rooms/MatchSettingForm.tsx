"use client";

import { useForm } from "react-hook-form";
import axiosInstance, { FormMetadata, UserData } from "@/utils/axios";
import { useTranslations } from "next-intl";
import useMatchSettingStore, {
  GameType,
} from "@/utils/stores/useMatchSettingStore";
import React, { useEffect, useState } from "react";
import MatchingModal from "@/app/(game)/rooms/MatchingModal";
import { MatchingMode } from "@/utils/hooks/old-frog-mahjong/useOldFrogMahjong";
import usePreloadAssets from "@/utils/hooks/usePreloadAssets";
import ModalContainer from "@/utils/components/ModalContainer";
import EditProfileImage from "@/app/(game)/rooms/EditProfileImage";
import ProgressBar from "@/utils/components/ProgressBar";
import useProfileIconStore from "@/utils/stores/useProfileIconStore";
import NokoriCoins from "@/app/(game)/rooms/NokoriCoins";
import GameTypeSwiper from "@/app/(game)/rooms/GameTypeSwiper";
import { getCookie } from "cookies-next";

type GameSettingFormProps = {
  formMetadata: FormMetadata;
  userData: UserData;
};

type GameSettingInputs = {
  timer: string;
  count: string;
  password: string;
};

const MatchSettingForm = ({ formMetadata, userData }: GameSettingFormProps) => {
  const m = useTranslations("MatchSettingForm");
  const [openMatchModal, setOpenMatchModal] = useState<null | MatchingMode>(
    null
  );

  const [hasValidSessionID, setHasValidSessionID] = useState(false);

  const gameType = useMatchSettingStore((s) => s.gameType);

  const { profileIcons } = useProfileIconStore();

  const accessToken = getCookie("accessToken") as string;

  const {
    loadImages,
    assetLength,
    isLoading,
    loadedAssetCount,
    isError,
    isLoaded,
    setFCM,
  } = usePreloadAssets();

  const progress = Math.floor((loadedAssetCount * 100) / assetLength);

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

  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  useEffect(() => {
    setCount(2);
    setTimer(formMetadata.timers[0]);
    loadImages();
    setFCM();

    const gameType = localStorage.getItem("gameType");

    if (!gameType) {
      localStorage.setItem("gameType", "WINGSPAN");
    }

    (async () => {
      const prevMode = localStorage.getItem("matchMode") as MatchingMode | null;
      const sessionID = localStorage.getItem("sessionID");

      if (prevMode && sessionID) {
        try {
          const { data: isValidSessionID } = await axiosInstance.post<boolean>(
            "/v0.1/rooms/session/check",
            {
              sessionID,
            },
            {
              headers: {
                tkn: accessToken,
              },
            }
          );

          if (isValidSessionID) {
            setHasValidSessionID(true);
          } else {
            setHasValidSessionID(false);
            localStorage.removeItem("sessionID");
            localStorage.removeItem("matchMode");
            localStorage.removeItem("pick");
            localStorage.removeItem("clearMissions");
            localStorage.removeItem("victoryFailed");
            localStorage.removeItem("isStarted");
          }
        } catch (e) {
          setHasValidSessionID(false);
          localStorage.removeItem("sessionID");
          localStorage.removeItem("matchMode");
          localStorage.removeItem("pick");
          localStorage.removeItem("clearMissions");
          localStorage.removeItem("victoryFailed");
          localStorage.removeItem("isStarted");
        }
      }
    })();
  }, []);

  watch((value) => {
    setCount(Number(value.count));
    setTimer(Number(value.timer));
    setPassword(value.password!);
  });

  if (isError) {
    return (
      <div className="w-full h-full flex flex-col justify-center items-center p-2">
        <div className="flex w-full h-[104px] justify-center items-center gap-4">
          failed to load assets
        </div>
      </div>
    );
  }

  if (isLoading || !isLoaded) {
    return (
      <div className="w-full h-full flex flex-col justify-center items-center p-2">
        <div className="flex w-full h-[104px] justify-center items-center gap-4">
          {assetLength === 0 ? (
            <p className="text-white">{m("getAsset")}</p>
          ) : (
            <ProgressBar progress={progress} />
          )}
        </div>
      </div>
    );
  }

  const prevMode = localStorage.getItem("matchMode") as MatchingMode | null;

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-rooms bg-center bg-cover p-2">
      {process.env.NODE_ENV !== "production" && (
        <p className="absolute left-0 top-0">{gameType}</p>
      )}

      {isProfileModalOpen && (
        <ModalContainer
          setIsOpen={setIsProfileModalOpen}
          customColor="bg-game-icon"
        >
          <EditProfileImage userData={userData} />
        </ModalContainer>
      )}

      {hasValidSessionID && prevMode && (
        <MatchingModal
          mode={prevMode}
          setOpenMatchModal={setOpenMatchModal}
          isReconnected
        />
      )}

      {openMatchModal && (
        <MatchingModal
          mode={openMatchModal}
          setOpenMatchModal={setOpenMatchModal}
        />
      )}

      <div className="max-w-2xl w-full">
        <div className="flex justify-center items-center gap-8">
          <button
            disabled={!isLoaded}
            onClick={() => setIsProfileModalOpen(true)}
            className="w-20 aspect-square"
          >
            {isLoaded ? (
              <img
                src={
                  profileIcons.find(
                    (profileIcon) =>
                      profileIcon.profileID === userData.profileID
                  )?.image!
                }
                alt="icon"
                className="w-full h-full"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 animate-pulse" />
            )}
          </button>
          <div className="font-bold">
            <p className="text-2xl">{userData.name}</p>
            <NokoriCoins userData={userData} />
          </div>
        </div>

        <GameTypeSwiper />

        <form
          onSubmit={(e) => e.preventDefault()}
          className="w-full flex flex-col gap-8 landscape:mt-2"
        >
          <>
            <div className="flex flex-col">
              <label className="text-center text-2xl font-bold">
                {m("timeout")}
              </label>
              <div className="flex justify-between gap-2 mt-3">
                {formMetadata.timers.map((i) => (
                  <label
                    key={i}
                    className={`w-1/3 text-responsive-small flex font-bold justify-center cursor-pointer py-1 ${
                      timer === i
                        ? "bg-button-selected text-white"
                        : "bg-white text-green-600"
                    }`}
                  >
                    <input
                      type="radio"
                      value={i}
                      {...register("timer")}
                      hidden
                    />
                    {i}s
                  </label>
                ))}
              </div>
            </div>
            <div className="flex flex-col mb-4">
              <label className="text-center text-2xl font-bold">
                {m("maxPlayerNumber")}
              </label>
              <div className="flex justify-between gap-2 mt-3">
                {["2", "3", "4"].map((i) => (
                  <label
                    key={i}
                    className={`w-1/3 text-responsive-small flex font-bold justify-center cursor-pointer py-1 ${
                      count.toString() === i
                        ? "bg-button-selected text-white"
                        : "bg-white text-green-600"
                    }`}
                  >
                    <input
                      type="radio"
                      value={i}
                      {...register("count")}
                      hidden
                    />
                    {i}
                    {m("personCount")}
                  </label>
                ))}
              </div>
            </div>
            {userData.coin > 0 && (
              <div className="flex flex-col gap-4">
                <button
                  onClick={() => setOpenMatchModal("NORMAL")}
                  className="w-full bg-match-button font-bold text-white py-1 rounded text-responsive-small disabled:bg-gray-200"
                >
                  {m("normal")}
                </button>
                <div className="flex gap-4">
                  <button
                    onClick={() => setOpenMatchModal("CREATE")}
                    className="w-full bg-match-button font-bold text-white py-1 rounded text-responsive-small disabled:bg-gray-200"
                  >
                    {m("createRoom")}
                  </button>

                  <button
                    onClick={() => setOpenMatchModal("ENTER")}
                    className="w-full bg-match-button font-bold text-white py-1 rounded text-responsive-small disabled:bg-gray-200"
                  >
                    {m("enterRoom")}
                  </button>
                </div>
              </div>
            )}
            {userData.coin <= 0 && (
              <div className="flex h-[104px] justify-center bg-gray-200 items-center gap-4">
                <p>{m("noCoin")}</p>
              </div>
            )}
          </>
        </form>
      </div>
    </div>
  );
};

export default MatchSettingForm;
