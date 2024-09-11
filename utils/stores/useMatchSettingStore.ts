import { create } from "zustand";

type GameSettingStore = {
  timer: number;
  setTimer: (timer: number) => void;

  count: number;
  setCount: (count: number) => void;
};

const useMatchSettingStore = create<GameSettingStore>((set) => ({
  timer: 15,
  setTimer: (timer: number) => set({ timer }),

  count: 2,
  setCount: (count: number) => set({ count }),
}));

export default useMatchSettingStore;
