"use client";

import SignOutBtn from "@/utils/components/SignOutBtn";
import React from "react";
import { useTranslations } from "next-intl";
import { DrawData, Mission } from "@/utils/axios";
import { UserSocket } from "@/utils/constants/wingspan/socketTypes";
import useProfileIconStore from "@/utils/stores/useProfileIconStore";

const Page = () => {
  const m = useTranslations("error");

  const profileIcons = useProfileIconStore((s) => s.profileIcons);

  const isLoading = false;
  const drawData: DrawData = {
    users: [
      {
        userID: 1,
        successMissions: [1],
      },
      {
        userID: 2,
        successMissions: [1, 2],
      },
      {
        userID: 3,
        successMissions: [3],
      },
      {
        userID: 4,
        successMissions: [2, 3],
      },
    ],
  };

  const currentMissions: Mission[] = [
    {
      id: 1,
      description: "첫번째 미션 설명",
      image: "",
      title: "첫번째미션",
    },
    {
      id: 2,
      description: "두번째 미션 설명",
      image: "",
      title: "두번째미션",
    },
    {
      id: 3,
      description: "세번째 미션 설명",
      image: "",
      title: "세번째미션",
    },
  ];

  const users: UserSocket[] = [
    {
      id: 1,
      turnNumber: 1,
      playerState: "good",
      missionSuccessCount: 2,
      isOwner: false,
      email: "asd@asd.asd",
      profileID: 1,
      coin: 3,
      cards: null,
      discardedCards: null,
      name: "good",
      items: null,
      pickedCards: null,
    },
    {
      id: 2,
      turnNumber: 2,
      playerState: "good",
      missionSuccessCount: 2,
      isOwner: false,
      email: "asd@asd.asd",
      profileID: 1,
      coin: 3,
      cards: null,
      discardedCards: null,
      name: "good",
      items: null,
      pickedCards: null,
    },
    {
      id: 3,
      turnNumber: 3,
      playerState: "good",
      missionSuccessCount: 2,
      isOwner: false,
      email: "asd@asd.asd",
      profileID: 1,
      coin: 3,
      cards: null,
      discardedCards: null,
      name: "good",
      items: null,
      pickedCards: null,
    },
    {
      id: 4,
      turnNumber: 4,
      playerState: "good",
      missionSuccessCount: 2,
      isOwner: false,
      email: "asd@asd.asd",
      profileID: 1,
      coin: 3,
      cards: null,
      discardedCards: null,
      name: "good",
      items: null,
      pickedCards: null,
    },
  ];

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
