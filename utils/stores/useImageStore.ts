import { create } from "zustand";

type ImageStore = {
  isLoaded: boolean;
  setIsLoaded: (isLoaded: boolean) => void;

  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;

  isError: boolean;
  setIsError: (error: boolean) => void;

  loadedImagesCount: number;
  setLoadedImages: (loadedImagesCount: number) => void;
};

const useImageStore = create<ImageStore>((set) => ({
  isLoaded: false,
  setIsLoaded: (isLoaded: boolean) => set({ isLoaded }),

  isLoading: false,
  setIsLoading: (isLoading: boolean) => set({ isLoading }),

  isError: false,
  setIsError: (error: boolean) => set({ isError: error }),

  loadedImagesCount: 0,
  setLoadedImages: (loadedImagesCount: number) => set({ loadedImagesCount }),
}));

export default useImageStore;
