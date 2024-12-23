import { create } from "zustand";
import AudioAssets from "@/public/audios/audio_assets.mp3";

interface Clip {
  name: string;
  start: number; // 시작 시간 (초 단위)
  end: number; // 종료 시간 (초 단위)
  isLoop?: boolean;
}

interface AudioStore {
  audio: HTMLAudioElement | null;
  setAudio: (audio: HTMLAudioElement | null) => void;
  clips: Clip[];
  playClip: (clipName: string) => void;
  stopAudio: () => void;
}

const useAudioStore = create<AudioStore>((set, get) => ({
  audio: new Audio(AudioAssets),
  setAudio: (audio: HTMLAudioElement | null) => set({ audio }),
  clips: [
    { name: "cardMovieAudio", start: 0, end: 590 },
    { name: "cardChapAudio", start: 591, end: 777 },
    { name: "failAudio", start: 778, end: 2073 },
    { name: "commonStartAudio", start: 2074, end: 5364 },
    { name: "commonLoanAudio", start: 5365, end: 8724 },
    { name: "winAudio", start: 8725, end: 12636 },
    { name: "commonLoanFailedAudio", start: 12637, end: 14517 },
    { name: "commonAllReadyAudio", start: 14518, end: 17061 },
    { name: "myTurnAudio", start: 17062, end: 22485 },
    { name: "commonDrawAudio", start: 22486, end: 24477 },
    { name: "timeoutAudio", start: 24478, end: 26421 },
    { name: "cardSelect", start: 26422, end: 26853 },
    { name: "bg", start: 26854, end: 87092, isLoop: true },
    { name: "cardDiscard", start: 87093, end: 87524 },
    { name: "missionFailed", start: 87525, end: 91580 },
    { name: "missionSuccess", start: 91581, end: 92598 },
  ],
  playClip: (clipName) => {
    const { audio, clips } = get();
    if (!audio) return;

    const clip = clips.find((c) => c.name === clipName);
    if (clip) {
      audio.currentTime = clip.start;
      audio.play();

      const onTimeUpdate = () => {
        if (audio.currentTime >= clip.end) {
          if (clip.isLoop) {
            audio.currentTime = clip.start;
          } else {
            audio.pause();
            audio.removeEventListener("timeupdate", onTimeUpdate);
          }
        }
      };

      audio.addEventListener("timeupdate", onTimeUpdate);
    }
  },
  stopAudio: () => {
    const { audio } = get();
    if (audio) {
      audio.pause();
    }
  },
}));

export default useAudioStore;
