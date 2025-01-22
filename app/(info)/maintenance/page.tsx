import SignOutBtn from "@/utils/components/SignOutBtn";
import React from "react";
import { getTranslations } from "next-intl/server";

const Page = async () => {
  const m = await getTranslations("error");

  return (
    <>
      <div className="flex h-[calc(100dvh)] justify-center items-center flex-col">
        <p className="font-bold text-green-700 text-3xl">500</p>
        <p>{m("title")}</p>
        <div className="mt-4">
          <SignOutBtn noRequest />
        </div>
      </div>
    </>
  );
};

export default Page;
