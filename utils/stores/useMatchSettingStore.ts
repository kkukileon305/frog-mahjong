import { create } from "zustand";

export type GameType = "FROG_MAHJONG_OLD" | "FROG_MAHJONG";

type GameSettingStore = {
  timer: number;
  setTimer: (timer: number) => void;

  count: number;
  setCount: (count: number) => void;

  password: string;
  setPassword: (password: string) => void;

  gameType: GameType;
  setGameType: (gameType: GameType) => void;
};

const useMatchSettingStore = create<GameSettingStore>((set) => ({
  timer: 15,
  setTimer: (timer: number) => set({ timer }),

  count: 2,
  setCount: (count: number) => set({ count }),

  password: "",
  setPassword: (password: string) => set({ password }),

  gameType: "FROG_MAHJONG",
  setGameType: (gameType: GameType) => set({ gameType }),
}));

export default useMatchSettingStore;
