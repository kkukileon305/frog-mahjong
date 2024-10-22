"use client";

import useScreenOrientation from "@/utils/hooks/useScreenOrientation";
import useDetectNavigation from "@/utils/hooks/useDetectNavigation";
import { getCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import useFrogMahjongStore from "@/utils/stores/frog-mahjong/useFrogMahjongStore";
import AbnormalExit from "@/app/(game)/rooms/quick-game/AbnormalExit";
import Entering from "@/app/(game)/rooms/quick-game/Entering";
import Game from "@/app/(game)/rooms/frog-mahjong/Game";

const Page = () => {
  const orientation = useScreenOrientation();

  useDetectNavigation();

  const userID = getCookie("userID") as string;

  const router = useRouter();
  const [isHelpModal, setIsHelpModal] = useState(false);
  const gameStore = useFrogMahjongStore();

  const currentUser = gameStore.gameState?.users?.find(
    (user) => user.id === Number(userID)
  );

  useEffect(() => {
    if (!gameStore.gameState?.gameInfo) {
      router.push("/rooms");
    }
  }, []);

  if (!gameStore.gameState?.gameInfo) {
    return <></>;
  }

  // abnormal
  if (gameStore.isAbnormalExit) {
    return <AbnormalExit />;
  }

  // loading
  if (!currentUser) {
    return <Entering />;
  }

  return (
    <div className="flex h-dvh overflow-hidden">
      <div className="relative w-full flex flex-col justify-between">
        {/*  結果モーダル*/}
        {/* ヘルプモーダル */}

        <Game setIsHelpModal={setIsHelpModal} />
      </div>
    </div>
  );
};

export default Page;
