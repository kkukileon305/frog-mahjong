"use client";

import React from "react";
import { getCookie } from "cookies-next";

type RoomDetailProps = {
  params: { roomId: string };
};

const Page = ({ params: { roomId } }: RoomDetailProps) => {
  const accessToken = getCookie("accessToken") as string;

  return <div className="flex h-[calc(100vh-64px)]">내부</div>;
};

export default Page;
