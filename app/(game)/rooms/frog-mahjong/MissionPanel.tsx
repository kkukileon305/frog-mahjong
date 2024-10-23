"use client";
import useFrogMahjongStore from "@/utils/stores/frog-mahjong/useFrogMahjongStore";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

const MissionPanel = () => {
  const { allMissions, missionID } = useFrogMahjongStore((s) => ({
    allMissions: s.missions,
    missionID: s.gameState?.gameInfo?.missionID as number,
  }));
  const [isPicked, setIsPicked] = useState(false);

  const currentMission = allMissions.find((m) => m.id === missionID);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsPicked(true);
    }, 5000);

    return () => clearTimeout(timeout);
  }, []);

  if (!isPicked) {
    return <p>roulette effect</p>;
  }

  return <p className="flex gap-4">{currentMission && currentMission.title}</p>;
};

export default MissionPanel;
