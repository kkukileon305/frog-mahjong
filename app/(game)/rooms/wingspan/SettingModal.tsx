"use client";

import React, { ChangeEventHandler, useState } from "react";
import Link from "next/link";
import ModalContainer from "@/utils/components/ModalContainer";
import { useTranslations } from "next-intl";
import useSoundStore from "@/utils/stores/useSoundStore";
import useWingspanStore from "@/utils/stores/wingspan/useWingspanStore";

const SettingModal = () => {
  const m = useTranslations("Settings");
  const { setVolume, volume, audios } = useSoundStore((s) => ({
    volume: s.volume,
    setVolume: s.setVolume,
    audios: s.audios,
  }));

  const setIsOpen = useWingspanStore((s) => s.setIsSettingModal);

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
    <ModalContainer setIsOpen={setIsOpen}>
      <div>
        <div className="bg-white hover:bg-gray-200 p-2 flex flex-col items-center gap-4">
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
              className="slider-volume focus:outline-none w-full bg-transparent accent-[#416A58] appearance-none absolute left-0 top-[calc(50%)] -translate-y-1/2"
            />
          </div>
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
  );
};

export default SettingModal;
