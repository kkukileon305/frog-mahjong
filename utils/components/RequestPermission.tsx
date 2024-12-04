"use client";

import { getCookie } from "cookies-next";
import { useEffect, useState } from "react";
import { registerServiceWorker } from "@/utils/functions/registerServiceWorker";
import { getToken, isSupported } from "@firebase/messaging";
import axiosInstance from "@/utils/axios";
import useMessagingStore from "@/utils/stores/useMessagingStore";

const RequestPermission = () => {
  const accessToken = getCookie("accessToken");

  const [curPermission, setCurPermission] =
    useState<NotificationPermission | null>(null);

  const { messaging } = useMessagingStore();

  async function retryGetDeviceToken(
    retries: number
  ): Promise<string | undefined> {
    if (!messaging) return;
    try {
      return await getToken(messaging, {
        vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
      });
    } catch (error) {
      if (retries === 0) {
        console.error("최대 재시도 횟수 초과:", error);
        throw error;
      } else {
        console.warn(`getDeviceToken 재시도 중... 남은 횟수: ${retries}`);
        return retryGetDeviceToken(retries - 1);
      }
    }
  }

  async function requestPermission(): Promise<void> {
    if (!messaging) return;

    registerServiceWorker();

    try {
      const permission = await Notification.requestPermission();
      setCurPermission(permission);

      if (permission === "granted") {
        // getToken은 브라우저가 필요해서 서버에 실행할 수 없음
        const token = await retryGetDeviceToken(5);

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
    if (!messaging) return;
    requestPermission();
  }, [messaging]);

  return <></>;
};

export default RequestPermission;
