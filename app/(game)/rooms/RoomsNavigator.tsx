"use client";

import { FaLongArrowAltLeft, FaLongArrowAltRight } from "react-icons/fa";
import { RoomsResponse } from "@/utils/axios";
import { SIZE } from "@/utils/const";

type RoomsNavigatorProps = {
  currentPage: number;
  data: RoomsResponse;
};

const RoomsNavigator = ({
  data: { rooms, total },
  currentPage,
}: RoomsNavigatorProps) => {
  const allPagesSize = Math.ceil(total / SIZE);

  return (
    <div className="flex justify-center">
      <FaLongArrowAltLeft />
      <ul className="flex gap-2">
        {Array(allPagesSize)
          .fill(null)
          .map((_, i) => i)
          .map((page) => (
            <li key={page}>{page + 1}</li>
          ))}
      </ul>
      <FaLongArrowAltRight />
    </div>
  );
};

export default RoomsNavigator;
