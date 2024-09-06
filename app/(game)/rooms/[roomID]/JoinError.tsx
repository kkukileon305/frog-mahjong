"use client";

import Link from "next/link";
import React from "react";
import { useTranslations } from "next-intl";

type JoinErrorProps = {
  isPasswordFailed: boolean;
  isProgress: boolean;
  isFullPlayer: boolean;
  isNoRoom: boolean;
};

const JoinError = ({
  isPasswordFailed,
  isProgress,
  isFullPlayer,
  isNoRoom,
}: JoinErrorProps) => {
  const m = useTranslations("JoinError");

  const pwErrorMessage = m("pwErrorMessage");
  const progressMessage = m("progressMessage");
  const fullPlayerMessage = m("fullPlayerMessage");
  const noRoomMessage = m("noRoomMessage");

  return (
    <div className="flex h-[calc(100dvh)] bg-gray-200 justify-center items-center">
      <div className="p-4 w-full max-w-3xl bg-white rounded-xl flex justify-center items-center flex-col">
        <p className="font-bold text-3xl">
          {isPasswordFailed && pwErrorMessage}
          {isProgress && progressMessage}
          {isFullPlayer && fullPlayerMessage}
          {isNoRoom && noRoomMessage}
        </p>
        <Link
          className="py-2 px-4 mt-4 border border-blue-400 rounded-xl text-blue-400 font-bold"
          href={"/rooms"}
        >
          {m("back")}
        </Link>
      </div>
    </div>
  );
};

export default JoinError;
