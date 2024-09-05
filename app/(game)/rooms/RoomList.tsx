import { RoomsResponse } from "@/utils/axios";
import React from "react";
import RoomsNavigator from "@/app/(game)/rooms/RoomsNavigator";
import { ROOM_BTN_SIZE } from "@/utils/const";
import EnterRoomBtn from "@/app/(game)/rooms/EnterRoomBtn";

type RoomComponentProps = {
  currentPage: number;
};

const RoomList = async ({ currentPage }: RoomComponentProps) => {
  const response = await fetch(
    process.env.NEXT_PUBLIC_BACKEND_URL +
      `/v0.1/rooms?page=${currentPage}&pageSize=${ROOM_BTN_SIZE}`,
    {
      cache: "no-cache",
    }
  );

  const data = (await response.json()) as RoomsResponse;

  return (
    <>
      <div
        style={{
          height: `${82 * ROOM_BTN_SIZE}px`,
        }}
        className="flex flex-col"
      >
        {data.rooms.map((room) => (
          <EnterRoomBtn key={room.id} room={room} />
        ))}

        {data.rooms.length === 0 && (
          <div className="h-full flex justify-center items-center">
            아직 개설된 방이 없습니다.
          </div>
        )}
      </div>

      <RoomsNavigator currentPage={currentPage} data={data} />
    </>
  );
};

export default RoomList;
