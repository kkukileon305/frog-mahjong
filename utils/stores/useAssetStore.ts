import { create } from "zustand";

type ImageStore = {
  isLoaded: boolean;
  setIsLoaded: (isLoaded: boolean) => void;

  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;

  isError: boolean;
  setIsError: (error: boolean) => void;

  loadedAssetCount: number;
  setLoadedAssetCount: (loadedAssetCount: number) => void;

  assetLength: number;
  setAssetLength: (assetLength: number) => void;
};

const useAssetStore = create<ImageStore>((set) => ({
  isLoaded: false,
  setIsLoaded: (isLoaded: boolean) => set({ isLoaded }),

  isLoading: false,
  setIsLoading: (isLoading: boolean) => set({ isLoading }),

  isError: false,
  setIsError: (error: boolean) => set({ isError: error }),

  loadedAssetCount: 0,
  setLoadedAssetCount: (loadedAssetCount: number) => set({ loadedAssetCount }),

  assetLength: 0,
  setAssetLength: (assetLength: number) => set({ assetLength }),
}));

export default useAssetStore;
