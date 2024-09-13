import React, { Suspense } from "react";
import Header from "@/app/Header";
import { getTranslations } from "next-intl/server";
import { FormMetadata } from "@/utils/axios";
import MatchSettingForm from "@/app/(game)/rooms/MatchSettingForm";
import Match from "@/app/(game)/rooms/Match";
import FormMetadataLoading from "@/app/(game)/rooms/FormMetadataLoading";

const Page = async () => {
  return (
    <>
      <Header />

      <div className="max-w-[800px] mx-auto py-4 px-2">
        <Suspense fallback={<FormMetadataLoading />}>
          <Match />
        </Suspense>
      </div>
    </>
  );
};

export default Page;
