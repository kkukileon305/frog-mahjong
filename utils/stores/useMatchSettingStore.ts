import { create } from "zustand";
import { MatchingMode } from "@/utils/hooks/old-frog-mahjong/useOldFrogMahjong";

export type GameType = "FROG_MAHJONG_OLD" | "WINGSPAN";

type GameSettingStore = {
  timer: number;
  setTimer: (timer: number) => void;

  count: number;
  setCount: (count: number) => void;

  password: string;
  setPassword: (password: string) => void;

  gameType: GameType;
  setGameType: (gameType: GameType) => void;

  mode: MatchingMode | null;
  setMode: (mode: MatchingMode) => void;
};

const useMatchSettingStore = create<GameSettingStore>((set) => ({
  timer: 15,
  setTimer: (timer: number) => set({ timer }),

  count: 2,
  setCount: (count: number) => set({ count }),

  password: "",
  setPassword: (password: string) => set({ password }),

  gameType: "WINGSPAN",
  setGameType: (gameType: GameType) => set({ gameType }),

  mode: null,
  setMode: (mode) => set({ mode }),
}));

export default useMatchSettingStore;
