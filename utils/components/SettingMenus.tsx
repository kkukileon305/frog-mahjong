"use client";

import useSoundStore from "@/utils/stores/useSoundStore";
import React, { ChangeEventHandler, useState } from "react";
import { useTranslations } from "next-intl";
import { FaPlay } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";

const SettingMenus = () => {
  const m = useTranslations("settings");
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
    }, 200);

    setDebounceTimeout(newTimeout);
  };

  return (
    <div className="relative group" tabIndex={0}>
      <div className="cursor-pointer hover:bg-gray-200 group-focus:bg-gray-200 p-2 rounded-xl">
        <IoMdSettings size={24} />
      </div>

      <div className="absolute top-[calc(100%+4px)] right-0 invisible group-focus:visible flex flex-col border rounded-xl overflow-hidden drop-shadow-lg">
        <div className="bg-white p-2 border-b">
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
          />

          <div
            className="w-fit cursor-pointer text-white bg-match-button py-2 px-4 rounded"
            onClick={() => audios?.cardChapAudio.play()}
          >
            <FaPlay />
          </div>
        </div>

        <div className="p-2 bg-white"></div>
      </div>
    </div>
  );
};

export default SettingMenus;
