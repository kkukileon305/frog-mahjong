import { RoomsResponse } from "@/utils/axios";
import { FaLock } from "react-icons/fa";
import React from "react";
import RoomsNavigator from "@/app/(game)/rooms/RoomsNavigator";
import { SIZE } from "@/utils/const";

type RoomComponentProps = {
  currentPage: number;
};

const RoomList = async ({ currentPage }: RoomComponentProps) => {
  const response = await fetch(
    process.env.NEXT_PUBLIC_BACKEND_URL +
      `/v0.1/rooms?page=${currentPage}&pageSize=${SIZE}`,
    {
      cache: "no-cache",
    }
  );

  const data = (await response.json()) as RoomsResponse;

  return (
    <>
      <ul
        style={{
          height: `${82 * SIZE}px`,
        }}
      >
        {data.rooms.map((room) => (
          <li
            key={room.id}
            className="mb-4 border border-gray-700 p-2 rounded-xl"
          >
            <div className="flex items-center gap-2">
              <p>{room.name}</p>
              {room.password && <FaLock />}
            </div>
            <div>
              <p>{room.state}</p>
            </div>
          </li>
        ))}
      </ul>
      <RoomsNavigator currentPage={currentPage} data={data} />
    </>
  );
};

export default RoomList;
