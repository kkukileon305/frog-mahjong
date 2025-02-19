"use client";

import React, { Dispatch, SetStateAction, useState } from "react";
import { useTranslations } from "next-intl";
import { deleteCookie, getCookie } from "cookies-next";
import axiosInstance from "@/utils/axios";
import { useRouter } from "next/navigation";

const QuitModal = ({
  setIsQuitModalOpen,
}: {
  setIsQuitModalOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const m = useTranslations("Quit");
  const router = useRouter();
  const accessToken = getCookie("accessToken") as string;

  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const onClick = async () => {
    try {
      setIsLoading(true);

      await axiosInstance.delete("/v0.1/users", {
        headers: {
          tkn: accessToken,
        },
      });

      deleteCookie("accessToken");
      deleteCookie("refreshToken");
      deleteCookie("userID");

      router.push("/");
      router.refresh();
    } catch (e) {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full h-full p-4 rounded-[7px] bg-[#E1EDE9] justify-between overflow-y-auto absolute z-30 font-extrabold flex flex-col gap-4">
      <p className="text-center font-bold text-xl">{m("title")}</p>

      <div className="p-2 rounded">
        <p className="text-center">{m("warning")}</p>
      </div>

      {isError && <p className="text-center text-red-500">{m("fail")}</p>}

      <div className="flex gap-2">
        <button
          id="back"
          disabled={isLoading}
          onClick={() => setIsQuitModalOpen(false)}
          className="w-full bg-match-button font-bold text-white py-2 rounded text-xl disabled:bg-gray-200"
        >
          {m("back")}
        </button>

        <button
          onClick={onClick}
          disabled={isLoading}
          className="w-full bg-red-400 font-bold text-white py-2 rounded text-xl disabled:bg-gray-200"
        >
          {m("title")}
        </button>
      </div>
    </div>
  );
};

export default QuitModal;
