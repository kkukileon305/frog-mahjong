import { create } from "zustand";
import { MessagePayload } from "@firebase/messaging";

type Notification = MessagePayload & { id: number };

type NotificationStore = {
  notifications: Notification[];
  addNotification: (n: Notification) => void;
  removeNotification: (id: number) => void;
};

const useNotificationStore = create<NotificationStore>((set) => ({
  notifications: [],
  addNotification: (n) =>
    set((prev) => ({
      notifications: [...prev.notifications, n],
    })),
  removeNotification: (id) =>
    set((prev) => ({
      notifications: prev.notifications.filter((n) => n.id !== id),
    })),
}));

export default useNotificationStore;
