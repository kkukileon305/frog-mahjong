import React, { Suspense } from "react";
import RoomList from "@/app/(game)/rooms/RoomList";
import RoomLoading from "@/app/(game)/rooms/RoomLoading";
import CreateRoomBtn from "@/app/(game)/rooms/CreateRoomBtn";
import Refresh from "@/utils/components/Refresh";
import Header from "@/app/Header";
import { getTranslations } from "next-intl/server";
import EnterRoomBtn from "@/app/(game)/rooms/EnterRoomBtn";

type RoomsPageProps = {
  searchParams: { page: string };
};

const Page = async ({ searchParams }: RoomsPageProps) => {
  const m = await getTranslations("Rooms");
  const currentPage = Number(searchParams.page) || 1;

  return (
    <>
      <Header />
      <div className="bg-rooms bg-cover bg-center min-h-[calc(100dvh-64px)]">
        <div className="max-w-[800px] mx-auto py-4 px-2">
          <div className="h-11 flex items-center rounded-full bg-green-600 p-2 font-bold text-white text-center mb-4">
            <p className="basis-1/4">{m("roomState")}</p>
            <p className="basis-2/4">{m("roomTitle")}</p>
            <p className="basis-1/4">{m("playerCount")}</p>
          </div>
          <Suspense fallback={<RoomLoading />}>
            <RoomList currentPage={currentPage} />
          </Suspense>
          <div className="flex flex-col items-center justify-between gap-4 mt-4 md:flex-row">
            <CreateRoomBtn />
            <EnterRoomBtn />
            <Refresh className="w-full md:basis-1/3 border py-2 rounded-xl" />
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
