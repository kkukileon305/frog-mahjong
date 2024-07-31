"use client";

import { UserSocket } from "@/utils/socketTypes";

const UserList = ({ user }: { user: UserSocket }) => {
  return (
    <li className="p-2 bg-blue-400 text-white font-bold rounded-xl mb-2">
      <p>{user.name}</p>
      <p>{user.email}</p>
    </li>
  );
};

export default UserList;
