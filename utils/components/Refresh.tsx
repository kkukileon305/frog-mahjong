"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useTranslations } from "next-intl";

type RefreshProps = {
  className: string;
};

const Refresh = ({ className }: RefreshProps) => {
  const m = useTranslations("Refresh");

  const router = useRouter();

  useEffect(() => {
    router.refresh();
  }, []);

  return (
    <button className={className} onClick={router.refresh}>
      {m("title")}
    </button>
  );
};

export default Refresh;
