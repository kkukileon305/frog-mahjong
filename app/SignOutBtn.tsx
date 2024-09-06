"use client";

import { useRouter } from "next/navigation";
import { deleteCookie, getCookie } from "cookies-next";
import axiosInstance from "@/utils/axios";
import { useState } from "react";
import { useTranslations } from "next-intl";

const SignOutBtn = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const accessToken = getCookie("accessToken");

  const m = useTranslations("Header");

  const signOut = async () => {
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
  };

  return (
    <button disabled={isLoading} onClick={signOut}>
      {m("signOut")}
    </button>
  );
};

export default SignOutBtn;
