import { RoomsResponse } from "@/utils/axios";
import React from "react";
import RoomsNavigator from "@/app/(game)/rooms/RoomsNavigator";
import { ROOM_BTN_SIZE } from "@/utils/const";
import EnterRoomBtn from "@/app/(game)/rooms/EnterRoomBtn";
import { getTranslations } from "next-intl/server";

type RoomComponentProps = {
  currentPage: number;
};

const RoomList = async ({ currentPage }: RoomComponentProps) => {
  const m = await getTranslations("RoomList");

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
            {m("noRooms")}
          </div>
        )}
      </div>

      <RoomsNavigator currentPage={currentPage} data={data} />
    </>
  );
};

export default RoomList;
