"use client";

import useSoundStore from "@/utils/hooks/useSoundStore";
import { useEffect } from "react";

const LoadAudio = () => {
  const init = useSoundStore((s) => s.init);

  useEffect(() => {
    init();
  }, []);

  return <></>;
};

export default LoadAudio;
