import React, { Suspense } from "react";
import Match from "@/app/(game)/rooms/Match";
import FormMetadataLoading from "@/app/(game)/rooms/FormMetadataLoading";
import SettingMenus from "@/utils/components/SettingMenus";
import Notification from "@/app/(game)/rooms/Notification";

const Page = async () => {
  return (
    <div className="relative">
      <div className="h-[calc(100dvh)] flex items-center w-full mx-auto">
        <Notification />
        <Suspense fallback={<FormMetadataLoading />}>
          <Match />
        </Suspense>

        <div className="w-full absolute flex justify-end top-0 left-0 text-black">
          <SettingMenus />
        </div>
      </div>
    </div>
  );
};

export default Page;
