import React from "react";
import Refresh from "@/utils/Refresh";
import RoomOutBtn from "@/app/(game)/rooms/[roomId]/RoomOutBtn";
import { getCookie } from "cookies-next";
import { cookies } from "next/headers";
import { RoomUserInfoResponse } from "@/utils/axios";
import Game from "@/app/(game)/rooms/[roomId]/Game";

type RoomDetailProps = {
  params: { roomId: string };
};

const Page = async ({ params: { roomId } }: RoomDetailProps) => {
  // const accessToken = getCookie("accessToken", { cookies });
  //
  // const response = await fetch(
  //   process.env.NEXT_PUBLIC_BACKEND_URL + `/v0.1/rooms/user?RoomID=${roomId}`,
  //   {
  //     cache: "no-cache",
  //     headers: {
  //       tkn: accessToken as string,
  //     },
  //   }
  // );
  //
  // const data = (await response.json()) as RoomUserInfoResponse;

  // TODO: ページから変な方法で出る時？

  return (
    <div className="flex h-[calc(100vh-64px)]">
      <div className="border-r w-[300px] h-full">
        <ul className="h-[calc(100%-109px)]">
          {/*{data.users.map((user) => (*/}
          {/*  <li key={user.userID}>{user.userName}</li>*/}
          {/*))}*/}
        </ul>
        <div className="h-[109px] border-t p-2">
          <Refresh className="flex justify-center items-center gap-4 border rounded-xl w-full py-2" />
          <RoomOutBtn roomId={roomId} />
        </div>
      </div>
      <Game />
    </div>
  );
};

export default Page;
