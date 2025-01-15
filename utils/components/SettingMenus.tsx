"use client";

import useSoundStore from "@/utils/stores/useSoundStore";
import React, { ChangeEventHandler, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { IoMdSettings } from "react-icons/io";
import Link from "next/link";
import ModalContainer from "@/utils/components/ModalContainer";
import QuitModal from "@/app/(game)/rooms/QuitModal";
import SignOutBtn from "@/utils/components/SignOutBtn";
import { getCookie } from "cookies-next";
import useMatchSettingStore from "@/utils/stores/useMatchSettingStore";
import SwitchLocaleSlide from "@/utils/components/SwitchLocaleSlide";
import OnlyClient from "@/utils/components/OnlyClient";
import RequestPermission from "@/utils/components/RequestPermission";
import { FaBell } from "react-icons/fa6";

const SettingMenus = () => {
  // const curPermission = useRequestPermission();
  const m = useTranslations("Settings");

  const refreshToken = getCookie("refreshToken");

  const [notificationStatus, setNotificationStatus] = useState<
    "granted" | "default" | "denied" | null
  >(null);

  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      setNotificationStatus(Notification.permission);
    }
  }, []);

  const [isOpen, setIsOpen] = useState(false);
  const [isQuitModalOpen, setIsQuitModalOpen] = useState<boolean>(false);

  const { setVolume, volume, audios } = useSoundStore((s) => ({
    volume: s.volume,
    setVolume: s.setVolume,
    audios: s.audios,
  }));

  const { gameType, setGameType } = useMatchSettingStore((s) => ({
    gameType: s.gameType,
    setGameType: s.setGameType,
  }));

  const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout | null>(
    null
  );

  const handleVolumeChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    const newVolume = parseFloat(event.target.value);

    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }

    const newTimeout = setTimeout(() => {
      setVolume(newVolume);
      audios?.cardChapAudio.play();
    }, 200);

    setDebounceTimeout(newTimeout);
  };

  const handleGameTypeChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setGameType(e.currentTarget.checked ? "FROG_MAHJONG_OLD" : "WINGSPAN");
  };

  return (
    <>
      <OnlyClient>
        <RequestPermission />
      </OnlyClient>

      {isQuitModalOpen && (
        <ModalContainer setIsOpen={setIsQuitModalOpen}>
          <QuitModal />
        </ModalContainer>
      )}

      {isOpen && (
        <ModalContainer setIsOpen={setIsOpen}>
          <div>
            <div className="bg-white hover:bg-gray-200 p-2 flex flex-col items-center gap-4">
              <label htmlFor="volume">{m("volume")}</label>
              <input
                tabIndex={0}
                id="volume"
                type="range"
                min="0"
                max="1"
                step="0.01"
                defaultValue={volume}
                onChange={handleVolumeChange}
                className="focus:outline-none max-w-80 w-full bg-transparent accent-[#416A58]"
              />
            </div>

            <div className="bg-white">
              <Link
                className="p-4 block hover:bg-gray-200 text-center"
                href="https://parallel-jodhpur-935.notion.site/10d2c71ec7c580359d04cd5af3006252"
                target="_blank"
              >
                {m("term")}
              </Link>
            </div>

            <div className="bg-white">
              <Link
                className="p-4 block hover:bg-gray-200 text-center"
                href="https://parallel-jodhpur-935.notion.site/10d2c71ec7c580f3a788e47b22a57dd3"
                target="_blank"
              >
                {m("privacy")}
              </Link>
            </div>
            <div className="bg-white">
              <Link
                className="p-4 block hover:bg-gray-200 text-center"
                href="/license"
              >
                {m("license")}
              </Link>
            </div>

            {refreshToken && (
              <>
                <div className="bg-gray-200 h-[1px]" />

                <div className="bg-white">
                  <button
                    onClick={() => {
                      setIsQuitModalOpen(true);
                      setIsOpen(false);
                    }}
                    className="w-full text-center text-red-500 text-left p-4 block hover:bg-gray-200"
                  >
                    {m("quit")}
                  </button>
                </div>

                <div className="bg-white">
                  <SignOutBtn />
                </div>
              </>
            )}
            <div className="my-2">
              <SwitchLocaleSlide />
            </div>

            <div className="bg-white w-full flex justify-center gap-4 items-center">
              <span className="ms-2 font-medium text-gray-900 flex items-center gap-2">
                {m("notification")} <FaBell color="#95C1A6" size={28} />
              </span>
              <label className="w-fit inline-flex items-center cursor-pointer text-[#416A58] justify-center py-2 font-bold">
                {notificationStatus === "granted" ? "ON" : "OFF"}
              </label>
            </div>

            <div className="flex justify-center mt-4">
              <button
                id="back"
                className="max-w-80 w-full bg-[#95C1A6] px-2 py-1 font-bold text-white"
              >
                {m("close")}
              </button>
            </div>
          </div>
        </ModalContainer>
      )}

      <div
        id="setting-button"
        className="w-fit absolute flex justify-end top-0 right-0 text-black z-10"
      >
        <button
          onClick={() => setIsOpen(true)}
          className="cursor-pointer p-2 rounded-xl"
        >
          <IoMdSettings size={24} />
        </button>
      </div>
    </>
  );
};

export default SettingMenus;
