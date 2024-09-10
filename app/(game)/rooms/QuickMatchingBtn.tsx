"use client";

import useQuickMatching from "@/utils/hooks/useQuickMatching";

const QuickMatchingBtn = () => {
  const { connectQuickMatchingSocket, isMatching } = useQuickMatching();

  return (
    <button
      disabled={isMatching}
      onClick={connectQuickMatchingSocket}
      className="w-full border py-2 rounded-xl"
    >
      {isMatching ? "매칭중" : "매칭하기"}
    </button>
  );
};

export default QuickMatchingBtn;
