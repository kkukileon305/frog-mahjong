import React, { Suspense } from "react";
import RoomList from "@/app/(game)/rooms/RoomList";
import RoomLoading from "@/app/(game)/rooms/RoomLoading";
import CreateRoomBtn from "@/app/(game)/rooms/CreateRoomBtn";
import Refresh from "@/utils/Refresh";
import Header from "@/app/Header";

type RoomsPageProps = {
  searchParams: { page: string };
};

const Page = async ({ searchParams }: RoomsPageProps) => {
  const currentPage = Number(searchParams.page) || 1;

  return (
    <>
      <Header />
      <div className="max-w-[800px] mx-auto mt-4">
        <Suspense fallback={<RoomLoading />}>
          <RoomList currentPage={currentPage} />
        </Suspense>
        <div className="flex justify-between gap-4 mt-4">
          <CreateRoomBtn />
          <Refresh className="w-1/2 border py-2 rounded-xl" />
        </div>
      </div>
    </>
  );
};

export default Page;
