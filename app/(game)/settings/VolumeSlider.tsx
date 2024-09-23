"use client";

import useSoundStore from "@/utils/stores/useSoundStore";
import { ChangeEventHandler, useState } from "react";
import { useTranslations } from "next-intl";
import { FaPlay } from "react-icons/fa";

const VolumeSlider = () => {
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

  const onPlay = async () => {};

  return (
    <div>
      <label htmlFor="volume">{m("volume")} </label>
      <input
        id="volume"
        type="range"
        min="0"
        max="1"
        step="0.01"
        defaultValue={volume}
        onChange={handleVolumeChange}
      />
      <button
        className="ml-4 text-white bg-match-button py-2 px-4 rounded"
        onClick={() => audios?.cardChapAudio.play()}
      >
        <FaPlay />
      </button>
    </div>
  );
};

export default VolumeSlider;
