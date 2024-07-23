"use client";

import { getCookie } from "cookies-next";
import { useState } from "react";
import axiosInstance from "@/utils/axios";
import { useRouter } from "next/navigation";
import { IoIosExit } from "react-icons/io";

type RoomOutProps = {
  roomId: string;
};

const RoomOut = ({ roomId }: RoomOutProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const accessToken = getCookie("accessToken");

  const onClick = async () => {
    setIsLoading(true);
    try {
      await axiosInstance.put(
        `/v0.1/rooms/out`,
        {
          roomID: Number(roomId),
        },
        {
          headers: {
            tkn: accessToken,
          },
        }
      );

      router.push("/rooms");
      router.refresh();
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={onClick}
      disabled={isLoading}
      className="flex justify-center items-center border rounded-xl w-full py-2 mt-2"
    >
      나가기 <IoIosExit size={24} />
    </button>
  );
};

export default RoomOut;