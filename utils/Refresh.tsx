"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

type RefreshProps = {
  className: string;
};

const Refresh = ({ className }: RefreshProps) => {
  const router = useRouter();

  useEffect(() => {
    router.refresh();
  }, []);

  return (
    <button className={className} onClick={router.refresh}>
      새로고침
    </button>
  );
};

export default Refresh;
