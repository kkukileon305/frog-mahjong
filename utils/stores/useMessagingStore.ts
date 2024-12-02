import { create } from "zustand";
import { getMessaging } from "firebase/messaging";
import { Messaging } from "@firebase/messaging";

type MessagingStore = {
  initialized: boolean;
  setInitialized: (initialized: boolean) => void;

  messaging: Messaging | null;
  setMessaging: (messaging: Messaging) => void;

  isSupported: boolean;
  setIsSupported: (isSupported: boolean) => void;
};

const useMessagingStore = create<MessagingStore>((set) => ({
  initialized: false,
  setInitialized: (initialized) =>
    set({
      initialized,
    }),

  messaging: null,
  setMessaging: (messaging) => set({ messaging }),

  isSupported: false,
  setIsSupported: (isSupported: boolean) => set({ isSupported }),
}));

export default useMessagingStore;
