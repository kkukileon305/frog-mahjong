import useFrogMahjongStore from "@/utils/stores/frog-mahjong/useFrogMahjongStore";
import { useEffect } from "react";

const useTimer = () => {
  const { setTimer, fullTime } = useFrogMahjongStore((s) => ({
    timer: s.timer,
    setTimer: s.setTimer,
    fullTime: s.gameState?.gameInfo?.timer,
  }));

  useEffect(() => {
    if (!fullTime) return;

    setTimer(fullTime);

    const intervalId = setInterval(() => {
      setTimer(useFrogMahjongStore.getState().timer - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [fullTime]);
};

export default useTimer;
