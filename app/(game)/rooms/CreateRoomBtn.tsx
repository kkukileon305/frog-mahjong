"use client";

import { useTranslations } from "next-intl";

const CreateRoomBtn = () => {
  const m = useTranslations("QuickMatchingBtn");

  return (
    <button className="w-full border py-2 rounded-xl">{m("createRoom")}</button>
  );
};

export default CreateRoomBtn;
