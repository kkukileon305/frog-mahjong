"use client";

import { MatchingMode } from "@/utils/hooks/old-frog-mahjong/useOldFrogMahjong";
import { CancelMatch } from "@/utils/constants/old-frog-mahjong/socketTypes";
import { CANCEL_MATCH } from "@/utils/constants/const";
import { getCookie } from "cookies-next";
import useOldFrogMahjongStore from "@/utils/stores/old-frog-mahjong/useOldFrogMahjongStore";
import { Dispatch, SetStateAction } from "react";
import { IoClose } from "react-icons/io5";
import useWingspanStore from "@/utils/stores/wingspan/useWingspanStore";
import useMatchSettingStore from "@/utils/stores/useMatchSettingStore";
import { useRouter } from "next/navigation";

type CancelMatchBtnProps = {
  setOpenMatchModal: Dispatch<SetStateAction<MatchingMode | null>>;
};

const CancelMatchBtn = ({ setOpenMatchModal }: CancelMatchBtnProps) => {
  const userID = getCookie("userID") as string;
  const router = useRouter();
  const oldFrogMahjongStore = useOldFrogMahjongStore();
  const frogMahjongStore = useWingspanStore();

  const gameType = useMatchSettingStore((s) => s.gameType);
  const store =
    gameType === "FROG_MAHJONG_OLD" ? oldFrogMahjongStore : frogMahjongStore;

  const cancelQuickMatchingSocket = () => {
    const request: CancelMatch = {
      userID: Number(userID),
      roomID: Number(store.gameState?.gameInfo?.roomID),
      event: CANCEL_MATCH,
      message: "",
    };

    store.ws?.send(JSON.stringify(request));
    store.clear();

    localStorage.removeItem("sessionID");
    localStorage.removeItem("matchMode");
    localStorage.removeItem("pick");
    localStorage.removeItem("clearMissions");
    localStorage.removeItem("victoryFailed");
    localStorage.removeItem("isStarted");

    setOpenMatchModal(null);
    router.refresh();
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
