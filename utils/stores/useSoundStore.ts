import { create } from "zustand";

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

  volume: 0.2,
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
