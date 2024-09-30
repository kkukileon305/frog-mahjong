import { create } from "zustand";
import commonAllReadySrc from "@/public/audios/all_ready.mp3";
import commonLoanSrc from "@/public/audios/loan.mp3";
import commonLoanFailedSrc from "@/public/audios/loanfailed.mp3";
import commonStartSrc from "@/public/audios/start.mp3";
import cardChapWavSrc from "@/public/audios/card_chap.wav";
import cardMoveSrc from "@/public/audios/card_move.wav";
import commonDrawSrc from "@/public/audios/draw.mp3";
import winAudioSrc from "@/public/audios/win.mp3";
import failAudioSrc from "@/public/audios/fail.mp3";
import myTurnSrc from "@/public/audios/myturn.mp3";
import timeoutSrc from "@/public/audios/timeout.mp3";

export type GameAudios = {
  commonAllReadyAudio: HTMLAudioElement;
  commonLoanAudio: HTMLAudioElement;
  commonLoanFailedAudio: HTMLAudioElement;
  commonStartAudio: HTMLAudioElement;
  cardChapAudio: HTMLAudioElement;
  cardMovieAudio: HTMLAudioElement;
  commonDrawAudio: HTMLAudioElement;
  winAudio: HTMLAudioElement;
  failAudio: HTMLAudioElement;
  myTurnAudio: HTMLAudioElement;
  timeoutAudio: HTMLAudioElement;
};

type SoundStore = {
  audios: GameAudios | null;
  setAudios: (audios: GameAudios) => void;

  volume: number;
  setVolume: (volume: number) => void;
};

const useSoundStore = create<SoundStore>((set) => ({
  audios: null,
  setAudios: (audios: GameAudios) => set({ audios }),

  volume: 0.5,
  setVolume: (volume: number) =>
    set((prev) => {
      if (prev.audios) {
        Object.values(prev.audios).forEach((audio) => {
          audio.volume = volume;
        });
      }

      localStorage.setItem("volume", volume.toString());
      return { audios: prev.audios, volume };
    }),
}));

export default useSoundStore;
