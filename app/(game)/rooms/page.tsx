import React, { Suspense } from "react";
import Match from "@/app/(game)/rooms/Match";
import FormMetadataLoading from "@/app/(game)/rooms/FormMetadataLoading";
import SettingMenus from "@/utils/components/SettingMenus";
import Notification from "@/app/(game)/rooms/Notification";

const Page = async () => {
  return (
    <div className="relative">
      <div className="max-w-[800px] min-h-[calc(100dvh-64px)] flex items-center w-full mx-auto py-4 px-2">
        <Suspense fallback={<FormMetadataLoading />}>
          <Match />
        </Suspense>

        <div className="w-full absolute flex justify-end top-0 left-0 text-black">
          <SettingMenus />
        </div>
      </div>

      <Notification />
    </div>
  );
};

export default Page;
