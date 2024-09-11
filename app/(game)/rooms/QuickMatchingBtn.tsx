"use client";

import useQuickMatching from "@/utils/hooks/useQuickMatching";
import useGameStore from "@/utils/stores/useGameStore";

const QuickMatchingBtn = () => {
  const connectQuickMatchingSocket = useQuickMatching();

  const { setIsGameEnd, isMatchingCompleted, isMatching } = useGameStore(
    (state) => ({
      isMatching: state.isMatching,
      setIsGameEnd: state.setIsGameEnd,
      isMatchingCompleted: state.isMatchingCompleted,
    })
  );

  const onClick = () => {
    connectQuickMatchingSocket();
    setIsGameEnd(false);
  };

  const getMessage = () => {
    if (isMatchingCompleted) {
      return "매칭완료!";
    } else {
      if (isMatching) {
        return "매칭중";
      }
      return "매칭하기";
    }
  };

  return (
    <button
      disabled={isMatching || isMatchingCompleted}
      onClick={onClick}
      className="w-full border py-2 rounded-xl"
    >
      {getMessage()}
    </button>
  );
};

export default QuickMatchingBtn;
