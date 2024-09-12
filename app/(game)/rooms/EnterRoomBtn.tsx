"use client";

import { useTranslations } from "next-intl";

const EnterRoomBtn = () => {
  const m = useTranslations("QuickMatchingBtn");

  return (
    <button className="w-full border py-2 rounded-xl">{m("enterRoom")}</button>
  );
};

export default EnterRoomBtn;
