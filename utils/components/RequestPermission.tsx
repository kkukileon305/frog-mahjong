"use client";

import { getCookie } from "cookies-next";
import { useEffect, useState } from "react";
import { messaging } from "@/utils/firebaseConfig";
import { registerServiceWorker } from "@/utils/functions/registerServiceWorker";
import { getToken } from "@firebase/messaging";
import axiosInstance from "@/utils/axios";

const RequestPermission = () => {
  const accessToken = getCookie("accessToken");

  const [curPermission, setCurPermission] = useState<NotificationPermission>(
    Notification.permission
  );

  async function requestPermission(): Promise<void> {
    if (!messaging) return;
    registerServiceWorker();

    try {
      const permission = await Notification.requestPermission();
      setCurPermission(permission);

      if (permission === "granted") {
        // getToken은 브라우저가 필요해서 서버에 실행할 수 없음
        const token = await getToken(messaging, {
          vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
        });

        // push_token을 server로 보내고 업데이트
        await axiosInstance.post(
          "/v0.1/auth/fcm-token",
          {
            fcmToken: token,
          },
          {
            headers: {
              tkn: accessToken,
            },
          }
        );
      } else if (permission === "denied") {
        console.log("denided");
      }
    } catch (e) {
      console.log(e, "푸시토큰 가져오기 실패");
    }
  }

  useEffect(() => {
    requestPermission();
  }, []);

  return <></>;
};

export default RequestPermission;
