import create from "zustand";
import AudioAssets from "@/public/audios/audio_assets.mp3";

interface Clip {
  name: string;
  start: number; // 시작 시간 (초 단위)
  end: number; // 종료 시간 (초 단위)
}

interface AudioStore {
  audio: HTMLAudioElement | null;
  clips: Clip[];
  currentClip: string | null;
  isPlaying: boolean;
  loadAudio: (src: string) => void;
  playClip: (clipName: string) => void;
  stopAudio: () => void;
}

const useAudioStore = create<AudioStore>((set, get) => ({
  audio: null,
  clips: [
    { name: "background", start: 0, end: 30 },
    { name: "victory", start: 31, end: 50 },
    { name: "defeat", start: 51, end: 70 },
  ],
  currentClip: null,
  isPlaying: false,
  loadAudio: (src) => {
    const audio = new Audio(src);
    set({ audio });
  },
  playClip: (clipName) => {
    const { audio, clips } = get();
    if (!audio) return;

    const clip = clips.find((c) => c.name === clipName);
    if (clip) {
      audio.currentTime = clip.start;
      audio.play();
      set({ currentClip: clipName, isPlaying: true });

      const onTimeUpdate = () => {
        if (audio.currentTime >= clip.end) {
          audio.pause();
          audio.removeEventListener("timeupdate", onTimeUpdate);
          set({ isPlaying: false });
        }
      };

      audio.addEventListener("timeupdate", onTimeUpdate);
    }
  },
  stopAudio: () => {
    const { audio } = get();
    if (audio) {
      audio.pause();
      set({ isPlaying: false, currentClip: null });
    }
  },
}));

export default useAudioStore;
