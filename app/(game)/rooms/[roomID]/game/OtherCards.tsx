"use client";

import { UserSocket } from "@/utils/socketTypes";

const OtherCards = ({ user }: { user?: UserSocket }) => {
  return <div>{user?.name}</div>;
};

export default OtherCards;
