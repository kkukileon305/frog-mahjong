"use client";

import { useEffect, useState } from "react";
import { MessagePayload, onMessage } from "@firebase/messaging";
import useNotificationStore from "@/utils/stores/useNotificationStore";
import useMessagingStore from "@/utils/stores/useMessagingStore";

const Notification = () => {
  const { notifications, addNotification, removeNotification } =
    useNotificationStore();
  const { messaging } = useMessagingStore();

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
  }, [messaging]);

  return (
    <div className="fixed left-4 top-4 z-50 w-[calc(100%-32px)]">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          onClick={() => removeNotification(notification.id)}
          className="w-full mx-auto mb-4 opacity-0 animate-fade-in-out shadow-lg flex items-center max-w-sm px-4 py-3 rounded-lg bg-white"
        >
          {notification.notification?.title}
        </div>
      ))}
    </div>
  );
};

export default Notification;
