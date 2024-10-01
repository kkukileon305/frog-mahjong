"use client";

import { MatchingMode } from "@/utils/hooks/useQuickMatching";
import { useTranslations } from "next-intl";
import { CancelMatch } from "@/utils/constants/socketTypes";
import { CANCEL_MATCH } from "@/utils/constants/const";
import { getCookie } from "cookies-next";
import useGameStore from "@/utils/stores/useGameStore";
import { Dispatch, SetStateAction } from "react";
import { IoClose } from "react-icons/io5";

type CancelMatchBtnProps = {
  setOpenMatchModal: Dispatch<SetStateAction<MatchingMode | null>>;
};

const CancelMatchBtn = ({ setOpenMatchModal }: CancelMatchBtnProps) => {
  const userID = getCookie("userID") as string;
  const store = useGameStore();

  const cancelQuickMatchingSocket = () => {
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
      disabled={store.isMatchingCompleted}
      onClick={cancelQuickMatchingSocket}
      className="absolute top-2 right-2 bg-yellow-button rounded-xl font-bold text-white disabled:bg-gray-400"
    >
      <IoClose className="text-3xl" />
    </button>
  );
};

export default CancelMatchBtn;
