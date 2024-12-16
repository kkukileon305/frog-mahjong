"use client";

import React, { useState } from "react";
import useFrogMahjongStore from "@/utils/stores/frog-mahjong/useFrogMahjongStore";
import { useTranslations } from "next-intl";
import { Mission } from "@/utils/axios";
import { FaCaretDown, FaCaretUp } from "react-icons/fa";

const HelpModal = () => {
  const m = useTranslations("HelpModal");
  const setIsHelpModal = useFrogMahjongStore((s) => s.setIsHelpModalOpen);
  const allMissions = useFrogMahjongStore((s) => s.allMissions);

  const [opens, setOpens] = useState(
    allMissions.map((mission) => ({ id: mission.id, isOpen: false }))
  );

  const onClick = (mission: Mission) => {
    const newOpens = opens.map((o) =>
      mission.id !== o.id
        ? o
        : {
            isOpen: !o.isOpen,
            id: o.id,
          }
    );

    setOpens(newOpens);
  };

  return (
    <div className="fixed left-0 top-0 w-full h-full bg-black/50 p-2 z-30 flex justify-center items-center">
      <div className="max-w-xl w-full h-full overflow-hidden bg-white p-4 rounded-xl shadow-lg">
        <div className="h-full flex flex-col gap-4">
          <div className="h-[calc(100%-32px)] overflow-y-scroll">
            {allMissions.map((mission) => (
              <div
                key={mission.id}
                className="flex flex-col rounded bg-game-icon w-full mb-4"
              >
                <button
                  className="w-full flex items-center gap-2 text-left p-2 font-bold text-white"
                  onClick={() => onClick(mission)}
                >
                  {mission.title}

                  {opens.find((o) => o.id === mission.id)!.isOpen ? (
                    <FaCaretUp />
                  ) : (
                    <FaCaretDown />
                  )}
                </button>
                <div
                  className="overflow-hidden transition-all"
                  style={{
                    height: opens.find((o) => o.id === mission.id)!.isOpen
                      ? 200
                      : 0,
                  }}
                >
                  <p className="whitespace-pre-wrap p-2 text-white">
                    {mission.description.replace(/\\n/g, "\n")}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <button
            className="w-full bg-match-button font-bold text-white py-1 rounded text-responsive-small disabled:bg-gray-200"
            onClick={() => setIsHelpModal(false)}
          >
            {m("close")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default HelpModal;
