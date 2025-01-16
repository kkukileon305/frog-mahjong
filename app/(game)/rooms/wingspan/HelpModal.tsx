"use client";

import React, { useState } from "react";
import useWingspanStore from "@/utils/stores/wingspan/useWingspanStore";
import { useTranslations } from "next-intl";
import HelpImage from "@/public/helps/help.jpg";
import {
  bodyParts,
  colorParts,
} from "@/utils/functions/wingspan/checkMissions";

const HelpModal = () => {
  const m = useTranslations("HelpModal");
  const setIsHelpModal = useWingspanStore((s) => s.setIsHelpModalOpen);

  const allMissions = useWingspanStore((s) => s.allMissions);

  const missions: {
    title: string;
    values: {
      textValue: string;
      imageValue?: string;
    }[];
  }[] = [
    {
      title: "컬러 미션",
      values: colorParts.map((part) => ({
        textValue: part,
      })),
    },
    {
      title: "신체부위 미션",
      values: bodyParts.map((part) => ({
        textValue: part,
      })),
    },
    {
      title: "둥지 미션",
      values: [
        {
          textValue: "지면형",
          imageValue: allMissions.find((m) => m.id === 15)?.image,
        },
        {
          textValue: "플랫형",
          imageValue: allMissions.find((m) => m.id === 13)?.image,
        },
        {
          textValue: "구멍형",
          imageValue: allMissions.find((m) => m.id === 14)?.image,
        },
        {
          textValue: "그릇형",
          imageValue: allMissions.find((m) => m.id === 12)?.image,
        },
      ],
    },
    {
      title: "서식지 미션",
      values: [
        {
          textValue: "숲",
          imageValue: allMissions.find((m) => m.id === 3)?.image,
        },
        {
          textValue: "초원",
          imageValue: allMissions.find((m) => m.id === 4)?.image,
        },
        {
          textValue: "물",
          imageValue: allMissions.find((m) => m.id === 5)?.image,
        },
      ],
    },
    {
      title: "부리방향 미션",
      values: [
        {
          textValue: "왼쪽",
          imageValue: allMissions.find((m) => m.id === 10)?.image,
        },
        {
          textValue: "오른쪽",
          imageValue: allMissions.find((m) => m.id === 9)?.image,
        },
      ],
    },
  ];

  return (
    <div className="fixed left-0 top-0 w-full h-full bg-game p-2 z-30 flex justify-center items-center">
      <div className="max-w-xl w-full h-full overflow-hidden bg-white/65 rounded-[5px] border-2 border-[#796858] shadow-lg">
        <div
          className="h-full flex flex-col p-2 gap-4"
          onClick={() => setIsHelpModal(false)}
        >
          <h2 className="text-[30px] font-extrabold text-[#FA4E38] text-center">
            미션설명
          </h2>

          <ul className="h-[calc(100%-109px)] gap-[10px] flex flex-col">
            {missions.map((m) => (
              <li
                key={m.title}
                className="h-1/6 rounded-[5px] border-2 border-[#F19830] bg-white p-3 flex flex-col justify-between gap-2"
              >
                <p className="text-[15px] h-[15px] flex justify-center items-center text-[#FA4E38] font-extrabold text-center">
                  {m.title}
                </p>

                <ul className="h-[calc(100%-23px)] flex flex-wrap justify-center items-center gap-x-3">
                  {m.values.map((v) => (
                    <li key={v.textValue} className="flex gap-1 items-center">
                      {v.imageValue && (
                        <img src={v.imageValue} className="w-6 h-6" alt="" />
                      )}

                      <p className="text-[15px] leading-[15px]">
                        {v.textValue}
                      </p>
                    </li>
                  ))}
                </ul>
              </li>
            ))}

            <li className="h-1/6 rounded-[5px] border-2 border-[#F19830] bg-white p-1 flex flex-col justify-center gap-2">
              <p className="text-[15px] h-[15px] text-[#FA4E38] font-extrabold text-center">
                새크기 미션
              </p>

              <p className="h-[calc(100%-23px)] text-[15px] flex justify-center items-center">
                이상 or 이하
              </p>
            </li>
          </ul>

          <button className="w-full max-w-[118px] mx-auto bg-[#FA4E38] rounded-full py-1 text-white font-bold disabled:bg-gray-400">
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};

export default HelpModal;
