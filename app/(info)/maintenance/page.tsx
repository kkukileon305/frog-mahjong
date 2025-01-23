import SignOutBtn from "@/utils/components/SignOutBtn";
import React from "react";
import { getTranslations } from "next-intl/server";
import HelpModal, { HelpContent } from "@/utils/components/HelpModal";
import HelpImage1 from "@/public/helps/kero/kero_score.jpg";
import HelpImage2 from "@/public/helps/kero/kero_cards.jpg";

const Page = async () => {
  const m = await getTranslations("error");

  const fakeHelp: HelpContent[] = [
    {
      title: "1",
      image: HelpImage1,
    },
    {
      title: "2",
      slides: [
        {
          subTitle: "sub 1",
          image: HelpImage2,
        },
        {
          subTitle: "sub 2",
          image: HelpImage2,
        },
      ],
    },
    {
      title: "2",
      image: HelpImage2,
    },
  ];

  return (
    <>
      <HelpModal helpContents={fakeHelp} />
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
