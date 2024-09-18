import Header from "@/app/Header";
import React from "react";
import VolumeSlider from "@/app/(game)/settings/VolumeSlider";
import LoadAudio from "@/app/(game)/rooms/LoadAudio";

const Page = () => {
  return (
    <>
      <Header />
      <VolumeSlider />
      <LoadAudio />
    </>
  );
};

export default Page;
