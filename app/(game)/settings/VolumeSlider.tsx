"use client";

import useSoundStore from "@/utils/hooks/useSoundStore";
import { ChangeEventHandler, useState } from "react";

const VolumeSlider = () => {
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
    <div>
      <label htmlFor="volume">Volume: </label>
      <input
        id="volume"
        type="range"
        min="0"
        max="1"
        step="0.01"
        defaultValue={volume}
        onChange={handleVolumeChange}
      />
      <button onClick={() => audios?.cardChapAudio.play()}>재생</button>
    </div>
  );
};

export default VolumeSlider;
