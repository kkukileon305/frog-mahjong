"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axiosInstance, { TokenType } from "@/utils/axios";
import { setCookie } from "cookies-next";

const Page = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get("code");

  const onSignInWithCode = async () => {
    if (code !== null) {
      try {
        const {
          data: { accessToken, refreshToken, userID },
        } = await axiosInstance.get<TokenType>(
          `/v0.2/auth/google/callback?code=${code}`
        );

        const today = new Date();

        setCookie("accessToken", accessToken, {
          expires: new Date(today.getTime() + 3600000 * 24 * 7),
        });

        setCookie("refreshToken", refreshToken, {
          expires: new Date(today.getTime() + 3600000 * 24 * 7),
        });

        setCookie("userID", userID, {
          expires: new Date(today.getTime() + 3600000 * 24 * 7),
        });

        router.refresh();
        router.push("/rooms");
      } catch (e) {
        router.push("/");
      }
    } else {
      router.push("/");
      router.refresh();
    }
  };

  useEffect(() => {
    onSignInWithCode();
  }, []);

  return (
    <div>
      <div className="mx-auto max-w-3xl min-h-[calc(100vh-64px)] flex justify-center items-center">
        <p className="text-3xl font-bold">인증중</p>
      </div>
    </div>
  );
};

export default Page;
