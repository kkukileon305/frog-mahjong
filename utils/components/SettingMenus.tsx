"use client";

import useSoundStore from "@/utils/stores/useSoundStore";
import React, { ChangeEventHandler, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { IoMdSettings } from "react-icons/io";
import Link from "next/link";

const SettingMenus = () => {
  const m = useTranslations("settings");

  const [isOpen, setIsOpen] = useState(false);
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

  return (
    <div id="setting" className="relative" tabIndex={0}>
      <div
        className={`cursor-pointer p-2 rounded-xl hover:bg-gray-200 ${
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
              {m("term")}
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingMenus;
