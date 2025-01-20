"use client";

import useSoundStore from "@/utils/stores/useSoundStore";
import React, {
  ChangeEventHandler,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from "react";
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
import Setting from "@/public/icons/setting.png";

type SettingMenusProps = {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
};

const SettingMenus = ({ isOpen, setIsOpen }: SettingMenusProps) => {
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

  const [isQuitModalOpen, setIsQuitModalOpen] = useState<boolean>(false);

  const { setVolume, volume, audios } = useSoundStore((s) => ({
    volume: s.volume,
    setVolume: s.setVolume,
    audios: s.audios,
  }));

  const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout | null>(
    null
  );

  const handleVolumeChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    const newVolume = parseFloat(event.target.value);
    setVolume(newVolume);

    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }

    const newTimeout = setTimeout(() => {
      audios?.cardChapAudio.play();
    }, 200);

    setDebounceTimeout(newTimeout);
  };

  return (
    <>
      <OnlyClient>
        <RequestPermission />
      </OnlyClient>

      {isQuitModalOpen && <QuitModal setIsQuitModalOpen={setIsQuitModalOpen} />}

      {isOpen && (
        <div className="w-full h-full p-4 rounded-[7px] bg-[#E1EDE9] flex flex-col justify-between overflow-y-auto absolute z-30 font-extrabold">
          <div className="flex flex-col items-center gap-2">
            <label htmlFor="volume">{m("volume")}</label>

            <div className="max-w-80 w-full h-8 relative">
              <div className="absolute w-full left-0 top-[calc(50%)] -translate-y-1/2 h-3 bg-[#95C1A6] rounded-full overflow-hidden">
                <div
                  className="absolute bg-[#416A58] h-full"
                  style={{
                    width: `calc(${volume * 100 + 1}%)`,
                  }}
                />
              </div>

              <input
                tabIndex={0}
                id="volume"
                type="range"
                min="0"
                max="1"
                step="0.01"
                defaultValue={volume}
                onChange={handleVolumeChange}
                className="slider-volume focus:outline-none w-full bg-transparent appearance-none absolute left-0 top-[calc(50%)] -translate-y-1/2"
              />
            </div>
          </div>

          <div className="bg-[#E1EDE9]">
            <Link
              className="p-2 block  text-center"
              href="https://parallel-jodhpur-935.notion.site/10d2c71ec7c580359d04cd5af3006252"
              target="_blank"
            >
              {m("term")}
            </Link>
          </div>

          <div className="bg-[#E1EDE9]">
            <Link
              className="p-2 block  text-center"
              href="https://parallel-jodhpur-935.notion.site/10d2c71ec7c580f3a788e47b22a57dd3"
              target="_blank"
            >
              {m("privacy")}
            </Link>
          </div>
          <div className="bg-[#E1EDE9]">
            <Link className="p-2 block  text-center" href="/license">
              {m("license")}
            </Link>
          </div>

          <div className="h-[1px] bg-[#95C1A6] w-full" />

          {refreshToken && (
            <>
              <div className="bg-gray-200 h-[1px]" />

              <div className="bg-[#E1EDE9]">
                <button
                  onClick={() => {
                    setIsQuitModalOpen(true);
                    setIsOpen(false);
                  }}
                  className="w-full text-center text-[#F15656] p-2 block "
                >
                  {m("quit")}
                </button>
              </div>

              <div className="bg-[#E1EDE9]">
                <SignOutBtn />
              </div>
            </>
          )}

          <div className="my-2">
            <SwitchLocaleSlide />
          </div>

          <div className="bg-[#E1EDE9] w-full flex justify-center gap-2 items-center">
            <span className="ms-2 font-medium text-gray-900 flex items-center gap-2">
              {m("notification")} <FaBell color="#95C1A6" size={28} />
            </span>
            <label className="w-fit inline-flex items-center cursor-pointer text-[#416A58] justify-center py-2 font-bold">
              {notificationStatus === "granted" ? "ON" : "OFF"}
            </label>
          </div>

          <div className="flex justify-center mt-4">
            <button
              onClick={() => setIsOpen(false)}
              className="max-w-80 w-full bg-[#95C1A6] px-2 py-1 font-bold text-white rounded-[1px]"
            >
              {m("close")}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default SettingMenus;
