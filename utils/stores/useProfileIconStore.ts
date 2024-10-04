import { create } from "zustand";

export type ProfileIcon = {
  name: string;
  profileID: number;
  totalCount: number;
  image: string;
};

type ProfileIconStore = {
  profileIcons: ProfileIcon[];
  setProfileIcon: (profileIcons: ProfileIcon[]) => void;

  isProfileIconLoading: boolean;
  setIsProfileIconLoading: (isProfileIconLoading: boolean) => void;
};

const useProfileIconStore = create<ProfileIconStore>((set) => ({
  profileIcons: [],
  setProfileIcon: (profileIcons) => set({ profileIcons }),

  isProfileIconLoading: false,
  setIsProfileIconLoading: (isProfileIconLoading: boolean) =>
    set({ isProfileIconLoading }),
}));

export default useProfileIconStore;
