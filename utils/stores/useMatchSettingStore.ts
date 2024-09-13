import { create } from "zustand";

type GameSettingStore = {
  timer: number;
  setTimer: (timer: number) => void;

  count: number;
  setCount: (count: number) => void;

  password: string;
  setPassword: (password: string) => void;

  isError: boolean;
  setIsError: (isError: boolean) => void;
};

const useMatchSettingStore = create<GameSettingStore>((set) => ({
  timer: 15,
  setTimer: (timer: number) => set({ timer }),

  count: 2,
  setCount: (count: number) => set({ count }),

  password: "",
  setPassword: (password: string) => set({ password }),

  isError: false,
  setIsError: (isError: boolean) => set({ isError }),
}));

export default useMatchSettingStore;
