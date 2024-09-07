import { create } from "zustand";
import { Room } from "@/utils/axios";

type EnterRoomType = {
  selectedRoom: Room | null;
  setSelectedRoom: (selectedRoom: Room | null) => void;
};

const useEnterRoomStore = create<EnterRoomType>((set) => ({
  selectedRoom: null,
  setSelectedRoom: (selectedRoom: Room | null) => set({ selectedRoom }),
}));

export default useEnterRoomStore;
