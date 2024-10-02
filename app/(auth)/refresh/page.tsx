"use client";

import { useTranslations } from "next-intl";
import { useEffect } from "react";
import axiosInstance from "@/utils/axios";
import { getCookie } from "cookies-next";
import { useRouter } from "next/navigation";

const Page = () => {
  const m = useTranslations("Callback");

  const userID = getCookie("userID") as string;

  const accessToken = getCookie("accessToken");
  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        await axiosInstance.get(`/v0.1/users/${userID}`, {
          headers: {
            tkn: accessToken,
          },
        });

        router.push("/rooms");
      } catch (e) {
        console.log(e);
      }
    })();
  }, []);

  return (
    <div>
      <div className="mx-auto max-w-3xl min-h-[calc(100dvh-64px)] flex justify-center items-center">
        <p className="text-3xl font-bold">{m("title")}</p>
      </div>
    </div>
  );
};

export default Page;
