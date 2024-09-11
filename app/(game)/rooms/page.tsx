import React from "react";
import Header from "@/app/Header";
import { getTranslations } from "next-intl/server";
import { FormMetadata } from "@/utils/axios";
import QuickMatchingBtn from "@/app/(game)/rooms/QuickMatchingBtn";
import MatchSettingForm from "@/app/(game)/rooms/MatchSettingForm";

const Page = async () => {
  const m = await getTranslations("Rooms");

  const data = await fetch(
    (process.env.NEXT_PUBLIC_BACKEND_URL as string) + "/v0.1/rooms/meta"
  );
  const formMetadata = (await data.json()) as FormMetadata;

  return (
    <>
      <Header />

      <div className="max-w-[800px] mx-auto py-4 px-2">
        <MatchSettingForm formMetadata={formMetadata} />

        <div className="flex flex-col items-center justify-between gap-4 mt-4 md:flex-row">
          <QuickMatchingBtn />
        </div>
      </div>
    </>
  );
};

export default Page;
