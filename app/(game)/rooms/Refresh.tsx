"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

const Refresh = () => {
  const router = useRouter();

  useEffect(() => {
    router.refresh();
  }, []);

  return (
    <button className="w-1/2 border py-2 rounded-xl" onClick={router.refresh}>
      새로고침
    </button>
  );
};

export default Refresh;
