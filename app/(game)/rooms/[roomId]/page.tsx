import React from "react";

type RoomDetailProps = {
  params: { roomId: string };
};

const Page = ({ params }: RoomDetailProps) => {
  return <div>{params.roomId}</div>;
};

export default Page;
