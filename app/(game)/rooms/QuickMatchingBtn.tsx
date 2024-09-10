"use client";

import useQuickMatching from "@/utils/hooks/useQuickMatching";

const QuickMatchingBtn = () => {
  const {
    connectQuickMatchingSocket,
    isMatching,
    setIsGameEnd,
    isMatchingCompleted,
  } = useQuickMatching();

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
