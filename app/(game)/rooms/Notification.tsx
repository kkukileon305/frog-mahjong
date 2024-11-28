"use client";

import { useEffect, useState } from "react";
import { MessagePayload, onMessage } from "@firebase/messaging";
import { messaging } from "@/utils/firebaseConfig";

const Notification = () => {
  const [toasts, setToasts] = useState<(MessagePayload & { id: number })[]>([]);

  useEffect(() => {
    if (!messaging) return;

    return onMessage(messaging, (payload) => {
      // foreground
      const id = Date.now();
      setToasts((prev) => [
        ...prev,
        {
          id,
          ...payload,
        },
      ]);

      setTimeout(() => {
        setToasts((prevToasts) =>
          prevToasts.filter((toast) => toast.id !== id)
        );
      }, 3000);
    });
  }, []);

  return (
    <div className="fixed left-4 top-4 z-50 w-[calc(100%-32px)]">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          onClick={() =>
            setToasts((prevToasts) =>
              prevToasts.filter((t) => toast.id !== t.id)
            )
          }
          className="w-full mx-auto mb-4 opacity-0 animate-fade-in-out shadow-lg flex items-center max-w-sm px-4 py-3 rounded-lg bg-white"
        >
          {toast.id}
        </div>
      ))}
    </div>
  );
};

export default Notification;
