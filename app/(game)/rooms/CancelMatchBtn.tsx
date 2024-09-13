"use client";

import useQuickMatching, { MatchingMode } from "@/utils/hooks/useQuickMatching";
import { useTranslations } from "next-intl";
import { CancelMatch } from "@/utils/constants/socketTypes";
import { CANCEL_MATCH } from "@/utils/constants/const";
import { getCookie } from "cookies-next";
import useGameStore from "@/utils/stores/useGameStore";
import { Dispatch, SetStateAction } from "react";

type CancelMatchBtnProps = {
  setOpenMatchModal: Dispatch<SetStateAction<MatchingMode | null>>;
};

const CancelMatchBtn = ({ setOpenMatchModal }: CancelMatchBtnProps) => {
  const userID = getCookie("userID") as string;
  const store = useGameStore();

  const m = useTranslations("QuickMatchingBtn");

  const cancelQuickMatchingSocket = () => {
    console.log(store.ws);

    const request: CancelMatch = {
      userID: Number(userID),
      roomID: Number(store.gameState?.gameInfo?.roomID),
      event: CANCEL_MATCH,
      message: "",
    };

    store.ws?.send(JSON.stringify(request));
    store.clear();

    setOpenMatchModal(null);
  };

  return (
    <button
      onClick={cancelQuickMatchingSocket}
      className="w-full max-w-44 bg-green-500 py-2 rounded-xl font-bold text-white"
    >
      {m("cancelMatch")}
    </button>
  );
};

export default CancelMatchBtn;
