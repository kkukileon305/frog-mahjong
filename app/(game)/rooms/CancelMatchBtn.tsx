"use client";

import useQuickMatching from "@/utils/hooks/useQuickMatching";
import { useTranslations } from "next-intl";

const CancelMatchBtn = () => {
  const m = useTranslations("QuickMatchingBtn");
  const { cancelQuickMatchingSocket } = useQuickMatching({
    addListener: false,
    mode: "NORMAL",
  });

  const onClick = () => {
    cancelQuickMatchingSocket();
  };

  return (
    <button
      onClick={onClick}
      className="w-full max-w-44 bg-green-500 py-2 rounded-xl font-bold text-white"
    >
      {m("cancelMatch")}
    </button>
  );
};

export default CancelMatchBtn;
