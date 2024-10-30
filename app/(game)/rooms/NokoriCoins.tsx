"use client";

import coinIcon from "@/public/icons/coin.png";
import { UserData } from "@/utils/axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type NokoriCoinsProps = {
  userData: UserData;
};

const NokoriCoins = ({ userData }: NokoriCoinsProps) => {
  const router = useRouter();

  const [nokoriTime, setNokoriTime] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const date = new Date();
      const m = date.getMinutes();
      const s = date.getSeconds();

      const totalSeconds = m * 60 + s;
      const remainderSeconds = totalSeconds % (60 * 5);

      if (remainderSeconds === 0) {
        router.refresh();
      }

      setNokoriTime(remainderSeconds);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const remainderMinutes = String(4 - Math.floor(nokoriTime / 60)).padStart(
    2,
    "0"
  );
  const remainderOnlySeconds = String(60 - (nokoriTime % 60)).padStart(2, "0");

  return (
    <div className="relative flex gap-1 items-center">
      <img src={coinIcon.src} alt="coin" className="w-6 aspect-square z-10" />
      <div className="bg-white/50 rounded-r h-5 w-28 pl-4 pr-2 absolute left-3 top-[calc(50%-10px)] flex justify-between items-center">
        <p className="text-[14px]">{userData.coin} / 30</p>

        {userData.coin !== 30 && (
          <p className="text-game-icon text-xs">
            {remainderMinutes}:{remainderOnlySeconds}
          </p>
        )}

        {userData.coin === 30 && (
          <p className="text-game-icon text-xs">05:00</p>
        )}
      </div>
    </div>
  );
};

export default NokoriCoins;
