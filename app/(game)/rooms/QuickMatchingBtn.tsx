"use client";

import useQuickMatching from "@/utils/hooks/useQuickMatching";
import useGameStore from "@/utils/stores/useGameStore";
import { useTranslations } from "next-intl";

type QuickMatchingBtnProps = {
  mode?: "NORMAL" | "CREATE" | "ENTER";
};

const QuickMatchingBtn = ({ mode = "NORMAL" }: QuickMatchingBtnProps) => {
  const m = useTranslations("QuickMatchingBtn");
  const { connectQuickMatchingSocket, cancelQuickMatchingSocket } =
    useQuickMatching(mode);

  const { setIsGameEnd, isMatchingCompleted, isMatching } = useGameStore(
    (state) => ({
      isMatching: state.isMatching,
      setIsGameEnd: state.setIsGameEnd,
      isMatchingCompleted: state.isMatchingCompleted,
    })
  );

  const onClick = () => {
    setIsGameEnd(false);

    if (isMatchingCompleted) return;

    if (isMatching) {
      cancelQuickMatchingSocket();
    } else {
      connectQuickMatchingSocket();
    }
  };

  const getMessage = () => {
    if (isMatchingCompleted) {
      return m("matchComplete");
    } else {
      if (isMatching) {
        return m("cancelMatch");
      }

      if (mode === "CREATE") {
        return m("createRoom");
      } else if (mode === "ENTER") {
        return m("enterRoom");
      } else {
        return m("match");
      }
    }
  };

  return (
    <button
      disabled={isMatchingCompleted}
      onClick={onClick}
      className="w-full border py-2 rounded-xl"
    >
      {getMessage()}
    </button>
  );
};

export default QuickMatchingBtn;
