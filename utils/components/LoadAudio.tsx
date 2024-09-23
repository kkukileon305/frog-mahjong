"use client";

import useSoundStore from "@/utils/stores/useSoundStore";
import { useEffect } from "react";

const LoadAudio = () => {
  const { init, audios, setVolume } = useSoundStore((s) => ({
    init: s.init,
    audios: s.audios,
    setVolume: s.setVolume,
  }));

  useEffect(() => {
    if (audios !== null) return;

    init();
    setVolume(parseFloat(localStorage.getItem("volume") || "0.5"));

    if (process.env.NODE_ENV === "development") {
      console.log("sound init!");
    }
  }, []);

  return <></>;
};

export default LoadAudio;
