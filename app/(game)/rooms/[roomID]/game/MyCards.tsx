"use client";

import { UserSocket } from "@/utils/socketTypes";

const MyCards = ({ user }: { user?: UserSocket }) => {
  return <div>{user?.name}</div>;
};

export default MyCards;
