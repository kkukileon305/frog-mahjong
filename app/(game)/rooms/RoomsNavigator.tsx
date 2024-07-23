"use client";

import { FaLongArrowAltLeft, FaLongArrowAltRight } from "react-icons/fa";
import { RoomsResponse } from "@/utils/axios";
import { SIZE } from "@/utils/const";
import Link from "next/link";

type RoomsNavigatorProps = {
  currentPage: number;
  data: RoomsResponse;
};

const RoomsNavigator = ({
  data: { rooms, total },
  currentPage,
}: RoomsNavigatorProps) => {
  const allPagesSize = Math.ceil(total / SIZE);
  const previousPage = currentPage - 1 >= 1 ? currentPage - 1 : 1;
  const nextPage = currentPage + 1;

  return (
    <div className="flex justify-center items-center gap-4">
      {currentPage > 1 ? (
        <Link href={`/rooms?page=${previousPage}`}>
          <FaLongArrowAltLeft size={32} />
        </Link>
      ) : (
        <FaLongArrowAltLeft size={32} className="text-gray-300" />
      )}
      <ul className="flex gap-2">
        {Array(allPagesSize)
          .fill(null)
          .map((_, i) => i)
          .map((page) => (
            <li key={page}>
              <Link
                className={`border aspect-square w-8 flex justify-center items-center rounded ${
                  currentPage === page + 1 &&
                  "border-blue-400 text-blue-400 font-bold"
                }`}
                href={`/rooms?page=${page + 1}`}
              >
                {page + 1}
              </Link>
            </li>
          ))}
      </ul>
      {currentPage < allPagesSize ? (
        <Link href={`/rooms?page=${nextPage}`}>
          <FaLongArrowAltRight size={32} />
        </Link>
      ) : (
        <FaLongArrowAltRight size={32} className="text-gray-300" />
      )}
    </div>
  );
};

export default RoomsNavigator;
