"use client";

import useQuickMatching from "@/utils/hooks/useQuickMatching";
import { useTranslations } from "next-intl";

const CancelMatchBtn = () => {
  const m = useTranslations("QuickMatchingBtn");
  const { cancelQuickMatchingSocket } = useQuickMatching();

  const onClick = () => {
    cancelQuickMatchingSocket();
  };

  return (
    <button onClick={onClick} className="w-full border py-2 rounded-xl">
      {m("cancelMatch")}
    </button>
  );
};

export default CancelMatchBtn;
