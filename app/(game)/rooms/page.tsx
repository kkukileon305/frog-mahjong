import React, { Suspense } from "react";
import Header from "@/app/Header";
import Match from "@/app/(game)/rooms/Match";
import FormMetadataLoading from "@/app/(game)/rooms/FormMetadataLoading";
import LoadAudio from "@/utils/components/LoadAudio";

const Page = async () => {
  return (
    <>
      <Header />

      <div className="max-w-[800px] min-h-[calc(100dvh-64px)] flex items-center w-full mx-auto py-4 px-2">
        <Suspense fallback={<FormMetadataLoading />}>
          <Match />
        </Suspense>
        <LoadAudio />
      </div>
    </>
  );
};

export default Page;
