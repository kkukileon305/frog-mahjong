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
import SettingMenus from "@/utils/components/SettingMenus";
import Setting from "@/public/icons/setting.png";
import Tutorial from "@/app/(game)/rooms/Tutorial";
import Quest from "@/public/icons/quest.png";
import useScreenOrientation from "@/utils/hooks/useScreenOrientation";
import WarningModal from "@/app/(game)/rooms/quick-game/WarningModal";

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
  const orientation = useScreenOrientation();
  const [openMatchModal, setOpenMatchModal] = useState<null | MatchingMode>(
    null
  );

  const [hasValidSessionID, setHasValidSessionID] = useState(false);

  const gameType = useMatchSettingStore((s) => s.gameType);

  const { profileIcons } = useProfileIconStore();

  const accessToken = getCookie("accessToken") as string;

  const [isSettingOpen, setIsSettingOpen] = useState(false);
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);

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
    <>
      {orientation !== "portrait-primary" && (
        <ModalContainer>
          <WarningModal direction="세로" jaDirection="縦" />
        </ModalContainer>
      )}
      <div className="w-full h-full flex flex-col items-center bg-center bg-cover px-2 py-10">
        {process.env.NODE_ENV !== "production" && (
          <p className="absolute left-0 top-0">{gameType}</p>
        )}

        <div
          id="setting-button"
          className="w-fit absolute flex justify-end top-0 right-0 text-black z-10"
        >
          <button
            onClick={() => {
              setIsSettingOpen(true);
              setIsProfileModalOpen(false);
            }}
            className="cursor-pointer p-2 rounded-xl"
          >
            <img
              src={Setting.src}
              alt="setting open modal"
              width={24}
              height={24}
            />
          </button>
        </div>

        <button
          onClick={() => setIsTutorialOpen(true)}
          className="absolute top-0 right-10 p-2 z-10"
        >
          <img src={Quest.src} alt="tutorial" width={24} height={24} />
        </button>

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

        <div className="max-w-2xl w-full h-full flex flex-col justify-between">
          <div className="flex justify-center items-center gap-8">
            <button
              disabled={!isLoaded}
              onClick={() => {
                setIsProfileModalOpen(true);
                setIsSettingOpen(false);
              }}
              className="w-[90px] aspect-square"
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
              <p className="text-[20px] w-[100px]">{userData.name}</p>
              <NokoriCoins userData={userData} />
            </div>
          </div>

          <form
            onSubmit={(e) => e.preventDefault()}
            className="w-full h-[calc(100%-90px)] flex flex-col landscape:mt-2"
          >
            <div className="relative flex flex-col h-[calc(100%-99px)] my-4 overflow-y-auto gap-8">
              <SettingMenus
                isOpen={isSettingOpen}
                setIsOpen={setIsSettingOpen}
              />

              {isProfileModalOpen && (
                <EditProfileImage
                  userData={userData}
                  setIsOpen={setIsProfileModalOpen}
                />
              )}

              {isTutorialOpen && <Tutorial setIsOpen={setIsTutorialOpen} />}

              <GameTypeSwiper />

              <div className="flex flex-col">
                <label className="text-center text-2xl font-bold">
                  {m("timeout")}
                </label>
                <div className="flex justify-between gap-2 mt-3">
                  {formMetadata.timers.map((i) => (
                    <label
                      key={i}
                      className={`w-1/3 text-responsive-small font-semibold rounded-[4px] flex justify-center cursor-pointer py-1 ${
                        timer === i
                          ? "bg-button-selected text-white"
                          : "bg-white text-[#289D4F]"
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
                      className={`w-1/3 text-responsive-small font-semibold rounded-[4px] flex justify-center cursor-pointer py-1 ${
                        count.toString() === i
                          ? "bg-button-selected text-white"
                          : "bg-white text-[#289D4F]"
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
            </div>
            {userData.coin > 0 && (
              <div className="flex flex-col gap-4">
                <button
                  onClick={() => {
                    setOpenMatchModal("NORMAL");
                    setIsSettingOpen(false);
                    setIsProfileModalOpen(false);
                  }}
                  className="w-full bg-match-button font-bold text-white py-2 rounded-[4px] text-[17px] disabled:bg-gray-200"
                >
                  {m("normal")}
                </button>
                <div className="flex gap-4">
                  <button
                    onClick={() => {
                      setOpenMatchModal("CREATE");
                      setIsSettingOpen(false);
                      setIsProfileModalOpen(false);
                    }}
                    className="w-full bg-match-button font-bold text-white py-2 rounded-[4px] text-[17px] disabled:bg-gray-200"
                  >
                    {m("createRoom")}
                  </button>

                  <button
                    onClick={() => {
                      setOpenMatchModal("ENTER");
                      setIsSettingOpen(false);
                      setIsProfileModalOpen(false);
                    }}
                    className="w-full bg-match-button font-bold text-white py-2 rounded-[4px] text-[17px] disabled:bg-gray-200"
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
          </form>
        </div>
      </div>
    </>
  );
};

export default MatchSettingForm;
