"use client";

import useQuickMatching from "@/utils/hooks/useQuickMatching";
import useGameStore from "@/utils/stores/useGameStore";
import { useTranslations } from "next-intl";

const QuickMatchingBtn = () => {
  const m = useTranslations("QuickMatchingBtn");
  const { connectQuickMatchingSocket, cancelQuickMatchingSocket } =
    useQuickMatching();

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
      return m("match");
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
