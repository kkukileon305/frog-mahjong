import { FormMetadata } from "@/utils/axios";
import MatchSettingForm from "@/app/(game)/rooms/MatchSettingForm";
import React from "react";

const Match = async () => {
  const data = await fetch(
    (process.env.NEXT_PUBLIC_BACKEND_URL as string) + "/v0.1/rooms/meta"
  );
  const formMetadata = (await data.json()) as FormMetadata;

  return <MatchSettingForm formMetadata={formMetadata} />;
};

export default Match;
