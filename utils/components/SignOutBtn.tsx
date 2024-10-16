"use client";

import { useRouter } from "next/navigation";
import { deleteCookie, getCookie } from "cookies-next";
import axiosInstance from "@/utils/axios";
import { useState } from "react";
import { useTranslations } from "next-intl";

type SignOutBtnProps = {
  isRequest?: boolean;
};

const SignOutBtn = ({ isRequest }: SignOutBtnProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const accessToken = getCookie("accessToken");

  const m = useTranslations("Header");

  const signOut = async () => {
    if (isRequest) {
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
        setIsLoading(false);
        deleteCookie("accessToken");
        deleteCookie("refreshToken");
        deleteCookie("userID");

        router.push("/signin");
        router.refresh();
      }
    }
  };

  return (
    <button
      disabled={isLoading}
      onClick={signOut}
      className="w-full flex p-2 hover:bg-gray-200 disabled:bg-gray-200 text-red-500"
    >
      {m("signOut")}
    </button>
  );
};

export default SignOutBtn;
