"use client";

import { useEffect, useState } from "react";
import { MessagePayload, onMessage } from "@firebase/messaging";
import { messaging } from "@/utils/firebaseConfig";
import useNotificationStore from "@/utils/stores/useNotificationStore";

const Notification = () => {
  const { notifications, addNotification, removeNotification } =
    useNotificationStore();

  useEffect(() => {
    if (!messaging) return;

    return onMessage(messaging, (payload) => {
      // foreground
      const id = Date.now();

      addNotification({
        id,
        ...payload,
      });

      setTimeout(() => {
        removeNotification(id);
      }, 3000);
    });
  }, []);

  return (
    <div className="fixed left-4 top-4 z-50 w-[calc(100%-32px)]">
      {notifications.map((toast) => (
        <div
          key={toast.id}
          onClick={() => removeNotification(toast.id)}
          className="w-full mx-auto mb-4 opacity-0 animate-fade-in-out shadow-lg flex items-center max-w-sm px-4 py-3 rounded-lg bg-white"
        >
          {toast.notification?.title}
        </div>
      ))}
    </div>
  );
};

export default Notification;
