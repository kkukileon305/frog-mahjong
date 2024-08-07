import { RoomsResponse } from "@/utils/axios";
import React from "react";
import RoomsNavigator from "@/app/(game)/rooms/RoomsNavigator";
import { SIZE } from "@/utils/const";
import EnterRoomBtn from "@/app/(game)/rooms/EnterRoomBtn";

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
      <div
        style={{
          height: `${82 * SIZE}px`,
        }}
        className="flex flex-col"
      >
        {data.rooms.map((room) => (
          <EnterRoomBtn key={room.id} room={room} />
        ))}
      </div>

      <RoomsNavigator currentPage={currentPage} data={data} />
    </>
  );
};

export default RoomList;
