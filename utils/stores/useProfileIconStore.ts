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
};

const useProfileIconStore = create<ProfileIconStore>((set) => ({
  profileIcons: [],
  setProfileIcon: (profileIcons) => set({ profileIcons }),
}));

export default useProfileIconStore;
