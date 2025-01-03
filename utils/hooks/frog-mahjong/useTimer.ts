import useFrogMahjongStore from "@/utils/stores/frog-mahjong/useFrogMahjongStore";
import { useEffect } from "react";

const useTimer = () => {
  const { setTimer, fullTime, setTimerId } = useFrogMahjongStore((s) => ({
    setTimer: s.setTimer,
    setTimerId: s.setTimerId,
    fullTime: s.gameState?.gameInfo?.timer,
  }));

  useEffect(() => {
    if (!fullTime) return;

    setTimer(fullTime);

    const intervalId = setInterval(() => {
      const newTime = useFrogMahjongStore.getState().timer - 1;

      setTimer(newTime);
    }, 1000);

    setTimerId(intervalId);
  }, [fullTime]);
};

export default useTimer;
