import { useRef } from "react";
import commonAllReadySrc from "@/public/audios/all_ready.mp3";
import commonLoanSrc from "@/public/audios/loan.mp3";
import commonLoanFailedSrc from "@/public/audios/loanfailed.mp3";
import commonStartSrc from "@/public/audios/start.mp3";

const useSounds = () => {
  const commonAllReadyAudio = useRef<HTMLAudioElement>(
    new Audio(commonAllReadySrc)
  );
  const commonLoanAudio = useRef<HTMLAudioElement>(new Audio(commonLoanSrc));
  const commonLoanFailedAudio = useRef<HTMLAudioElement>(
    new Audio(commonLoanFailedSrc)
  );
  const commonStartAudio = useRef<HTMLAudioElement>(new Audio(commonStartSrc));

  return {
    commonAllReadyAudio,
    commonLoanAudio,
    commonLoanFailedAudio,
    commonStartAudio,
  };
};

export default useSounds;
