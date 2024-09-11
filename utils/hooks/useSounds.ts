"use client";

import { useEffect, useRef, useState } from "react";
import commonAllReadySrc from "@/public/audios/all_ready.mp3";
import commonLoanSrc from "@/public/audios/loan.mp3";
import commonLoanFailedSrc from "@/public/audios/loanfailed.mp3";
import commonStartSrc from "@/public/audios/start.mp3";

const useSounds = () => {
  const [commonAllReadyAudio, setCommonAllReadyAudio] =
    useState<HTMLAudioElement | null>(null);
  const [commonLoanAudio, setCommonLoanAudio] =
    useState<HTMLAudioElement | null>(null);
  const [commonLoanFailedAudio, setCommonLoanFailedAudio] =
    useState<HTMLAudioElement | null>(null);
  const [commonStartAudio, setCommonStartAudio] =
    useState<HTMLAudioElement | null>(null);

  useEffect(() => {
    setCommonAllReadyAudio(new Audio(commonAllReadySrc));
    setCommonLoanAudio(new Audio(commonLoanSrc));
    setCommonLoanFailedAudio(new Audio(commonLoanFailedSrc));
    setCommonStartAudio(new Audio(commonStartSrc));
  }, []);

  return {
    commonAllReadyAudio,
    commonLoanAudio,
    commonLoanFailedAudio,
    commonStartAudio,
  };
};

export default useSounds;
