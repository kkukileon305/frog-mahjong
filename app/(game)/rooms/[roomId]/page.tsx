import React from "react";
import Refresh from "@/utils/Refresh";
import RoomOut from "@/app/(game)/rooms/[roomId]/RoomOut";

type RoomDetailProps = {
  params: { roomId: string };
};

const Page = async ({ params: { roomId } }: RoomDetailProps) => {
  // const response = await fetch(
  //   process.env.NEXT_PUBLIC_BACKEND_URL + `/v0.1/rooms/user`,
  //   {
  //     cache: "no-cache",
  //     headers: {
  //       tkn: getCookie("accessToken", { cookies }) as string,
  //       RoomID: roomId,
  //     },
  //   }
  // );
  //
  // const data = (await response.json()) as RoomUserInfoResponse;
  //
  // console.log(data);

  // TODO: ページから変な方法で出る時？

  return (
    <div className="flex h-[calc(100vh-64px)]">
      <div className="border-r w-[300px] h-full">
        <ul className="h-[calc(100%-109px)]">유저리스트 추가예정</ul>
        <div className="h-[109px] border-t p-2">
          <Refresh className="flex justify-center items-center gap-4 border rounded-xl w-full py-2" />
          <RoomOut roomId={roomId} />
        </div>
      </div>
    </div>
  );
};

export default Page;
