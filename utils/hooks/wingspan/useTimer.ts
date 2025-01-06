import useWingspanStore from "@/utils/stores/wingspan/useWingspanStore";
import { useEffect } from "react";

const useTimer = () => {
  const { setTimer, fullTime, setTimerId } = useWingspanStore((s) => ({
    setTimer: s.setTimer,
    setTimerId: s.setTimerId,
    fullTime: s.gameState?.gameInfo?.timer,
  }));

  useEffect(() => {
    if (!fullTime) return;

    setTimer(fullTime);

    const intervalId = setInterval(() => {
      const newTime = useWingspanStore.getState().timer - 1;

      setTimer(newTime);
    }, 1000);

    setTimerId(intervalId);
  }, [fullTime]);
};

export default useTimer;
