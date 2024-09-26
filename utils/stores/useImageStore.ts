import { create } from "zustand";

type ImageStore = {
  isLoaded: boolean;
  setIsLoaded: (isLoaded: boolean) => void;

  isError: boolean;
  setIsError: (error: boolean) => void;
};

const useImageStore = create<ImageStore>((set) => ({
  isLoaded: false,
  setIsLoaded: (isLoaded: boolean) => set({ isLoaded: isLoaded }),

  isError: false,
  setIsError: (error: boolean) => set({ isError: error }),
}));

export default useImageStore;
