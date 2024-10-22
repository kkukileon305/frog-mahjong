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
import { cookies } from "next/headers";
import useMatchSettingStore from "@/utils/stores/useMatchSettingStore";

const SettingMenus = () => {
  const m = useTranslations("Settings");

  const refreshToken = getCookie("refreshToken");

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

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as Element;

      setIsOpen(!!target.closest("#setting"));
    };

    window.addEventListener("mousedown", handler);

    return () => window.removeEventListener("mousedown", handler);
  }, []);

  const handleGameTypeChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setGameType(e.currentTarget.checked ? "FROG_MAHJONG_OLD" : "FROG_MAHJONG");
  };

  return (
    <>
      {isQuitModalOpen && (
        <ModalContainer setIsOpen={setIsQuitModalOpen}>
          <QuitModal />
        </ModalContainer>
      )}

      <div id="setting" className="relative" tabIndex={0}>
        <div
          className={`cursor-pointer p-2 landscape:p-1 rounded-xl hover:bg-gray-200 ${
            isOpen && "bg-gray-200"
          }`}
        >
          <IoMdSettings size={24} />
        </div>

        {isOpen && (
          <div className="absolute top-[calc(100%+4px)] right-0 flex flex-col border rounded-xl overflow-hidden drop-shadow-lg">
            <div className="bg-white hover:bg-gray-200 p-2 border-b">
              <label htmlFor="volume">{m("volume")} </label>
              <input
                tabIndex={0}
                id="volume"
                type="range"
                min="0"
                max="1"
                step="0.01"
                defaultValue={volume}
                onChange={handleVolumeChange}
                className="focus:outline-none"
              />
            </div>

            <div className="bg-white">
              <Link
                className="p-2 block hover:bg-gray-200"
                href="https://parallel-jodhpur-935.notion.site/10d2c71ec7c580359d04cd5af3006252"
                target="_blank"
              >
                {m("term")}
              </Link>
            </div>
            <div className="bg-white">
              <Link
                className="p-2 block hover:bg-gray-200"
                href="https://parallel-jodhpur-935.notion.site/10d2c71ec7c580f3a788e47b22a57dd3"
                target="_blank"
              >
                {m("privacy")}
              </Link>
            </div>
            <div className="bg-white">
              <Link className="p-2 block hover:bg-gray-200" href="/license">
                {m("license")}
              </Link>
            </div>

            <div className="bg-gray-200 h-[1px]" />

            <div className="bg-white w-full hover:bg-gray-200">
              <label className="w-full inline-flex items-center cursor-pointer justify-center py-2">
                <input
                  type="checkbox"
                  checked={gameType === "FROG_MAHJONG_OLD"}
                  onChange={handleGameTypeChange}
                  className="sr-only peer"
                />
                <div className="relative w-11 h-6 bg-gray-200 outline-none peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                  use old
                </span>
              </label>
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
                    className="w-full text-red-500 text-left p-2 block hover:bg-gray-200"
                  >
                    {m("quit")}
                  </button>
                </div>

                <div className="bg-white">
                  <SignOutBtn />
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default SettingMenus;
