"use client";

import React from "react";
import { useTranslations } from "next-intl";

const Entering = () => {
  const m = useTranslations("Entering");

  return (
    <div className="flex h-[calc(100dvh)] bg-gray-200 justify-center items-center">
      <div className="p-4 w-full max-w-3xl bg-white rounded-xl flex justify-center items-center">
        <p className="font-bold text-3xl">{m("title")}</p>
      </div>
    </div>
  );
};

export default Entering;
