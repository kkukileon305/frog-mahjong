"use client";

import { useRouter } from "next/navigation";
import { deleteCookie, getCookie } from "cookies-next";
import axiosInstance from "@/utils/axios";
import { useState } from "react";
import { useTranslations } from "next-intl";

type SignOutBtnProps = {
  noRequest?: boolean;
};

const SignOutBtn = ({ noRequest }: SignOutBtnProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const accessToken = getCookie("accessToken");

  const m = useTranslations("Header");

  const signOut = async () => {
    if (noRequest) {
      deleteCookie("accessToken");
      deleteCookie("refreshToken");
      deleteCookie("userID");

      router.push("/signin");
      router.refresh();
    } else {
      setIsLoading(true);
      try {
        await axiosInstance.post(
          "/v0.1/auth/logout",
          {},
          {
            headers: {
              tkn: accessToken,
            },
          }
        );
      } catch (e) {
        console.log("failed");
      } finally {
        if ("serviceWorker" in navigator) {
          const registrations =
            await navigator.serviceWorker.getRegistrations();
          for (let registration of registrations) {
            await registration.unregister();
          }
          // console.log("Service worker unregistered");
        }

        setIsLoading(false);
        deleteCookie("accessToken");
        deleteCookie("refreshToken");
        deleteCookie("userID");

        localStorage.removeItem("sessionID");
        localStorage.removeItem("matchMode");
        localStorage.removeItem("pick");
        localStorage.removeItem("clearMissions");
        localStorage.removeItem("victoryFailed");
        localStorage.removeItem("isStarted");

        router.push("/signin");
        router.refresh();
      }
    }
  };

  return (
    <button
      disabled={isLoading}
      onClick={signOut}
      className="w-full p-4  text-center disabled:bg-gray-200 text-[#F15656]"
    >
      {m("signOut")}
    </button>
  );
};

export default SignOutBtn;
