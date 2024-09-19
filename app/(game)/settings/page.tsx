import Header from "@/app/Header";
import React from "react";
import VolumeSlider from "@/app/(game)/settings/VolumeSlider";
import LoadAudio from "@/app/(game)/rooms/LoadAudio";

const Page = () => {
  return (
    <>
      <Header />
      <div className="max-w-[800px] min-h-[calc(100dvh-64px)] mx-auto flex justify-center items-center">
        <VolumeSlider />
      </div>
      <LoadAudio />
    </>
  );
};

export default Page;
