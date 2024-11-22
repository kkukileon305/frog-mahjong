import useFrogMahjongStore from "@/utils/stores/frog-mahjong/useFrogMahjongStore";
import { useEffect } from "react";

const useTimer = () => {
  const { setTimer, timer, fullTime } = useFrogMahjongStore((s) => ({
    timer: s.timer,
    setTimer: s.setTimer,
    fullTime: s.gameState?.gameInfo?.timer,
  }));

  useEffect(() => {
    if (!fullTime) return;

    setTimer(fullTime);
  }, []);
};

export default useTimer;
