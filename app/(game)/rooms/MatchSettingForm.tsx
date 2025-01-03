"use client";

import { useForm } from "react-hook-form";
import { FormMetadata, UserData } from "@/utils/axios";
import { useTranslations } from "next-intl";
import useMatchSettingStore from "@/utils/stores/useMatchSettingStore";
import React, { ChangeEventHandler, useEffect, useState } from "react";
import MatchingModal from "@/app/(game)/rooms/MatchingModal";
import { MatchingMode } from "@/utils/hooks/old-frog-mahjong/useOldFrogMahjong";
import usePreloadAssets from "@/utils/hooks/usePreloadAssets";
import ModalContainer from "@/utils/components/ModalContainer";
import EditProfileImage from "@/app/(game)/rooms/EditProfileImage";
import ProgressBar from "@/utils/components/ProgressBar";
import useProfileIconStore from "@/utils/stores/useProfileIconStore";
import NokoriCoins from "@/app/(game)/rooms/NokoriCoins";
import { decryptAES, encryptAES } from "@/utils/functions/aes";

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

  const { gameType, setGameType } = useMatchSettingStore((s) => ({
    gameType: s.gameType,
    setGameType: s.setGameType,
  }));

  const handleGameTypeChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setGameType(e.currentTarget.checked ? "FROG_MAHJONG_OLD" : "FROG_MAHJONG");
  };

  const { profileIcons } = useProfileIconStore();

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
  }, []);

  watch((value) => {
    setCount(Number(value.count));
    setTimer(Number(value.timer));
    setPassword(value.password!);
  });

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
      {isProfileModalOpen && (
        <ModalContainer
          setIsOpen={setIsProfileModalOpen}
          customColor="bg-game-icon"
        >
          <EditProfileImage userData={userData} />
        </ModalContainer>
      )}

      {prevMode && (
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

        <form
          onSubmit={(e) => e.preventDefault()}
          className="w-full flex flex-col gap-8 mt-8"
        >
          <>
            <div className="flex flex-col">
              <label className="text-center text-responsive font-bold">
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
              <label className="text-center text-responsive font-bold">
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

        <div className="w-full flex justify-center mt-2 gap-4">
          <span className="ms-3 text-sm font-medium text-gray-900 flex items-center">
            구버전으로 플레이
          </span>
          <label className="w-fit inline-flex items-center cursor-pointer justify-center py-2">
            <input
              type="checkbox"
              checked={gameType === "FROG_MAHJONG_OLD"}
              onChange={handleGameTypeChange}
              className="sr-only peer"
            />
            <div className="relative w-11 h-6 bg-gray-200 outline-none peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </div>
    </div>
  );
};

export default MatchSettingForm;
