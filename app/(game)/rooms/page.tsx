import React, { Suspense } from "react";
import UserList from "@/app/(game)/UserList";

const Page = () => {
  return (
    <div>
      <p>Rooms</p>
      <Suspense fallback={<div>Loading...</div>}>
        <UserList />
      </Suspense>
    </div>
  );
};

export default Page;
