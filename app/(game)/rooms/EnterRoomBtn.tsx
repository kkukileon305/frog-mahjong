"use client";

import { Room } from "@/utils/axios";
import { useState } from "react";
import { useRouter } from "next/navigation";
import EnterRoomForm from "@/app/(game)/rooms/EnterRoomForm";
import ModalContainer from "@/utils/components/ModalContainer";
import { useTranslations } from "next-intl";
import lockImage from "@/public/icons/lock.png";
import Image from "next/image";

type EnterRoomLinkProps = {
  room: Room;
};

const EnterRoomBtn = ({ room }: EnterRoomLinkProps) => {
  const m = useTranslations("EnterRoomBtn");

  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const onClick = () => {
    if (room.password) {
      // パスワードある場合
      setIsOpen(true);
    } else {
      router.push(`/rooms/${room.id}`);
    }
  };

  return (
    <>
      {isOpen && (
        <ModalContainer setIsOpen={setIsOpen}>
          <EnterRoomForm roomID={room.id} />
        </ModalContainer>
      )}

      <button
        onClick={onClick}
        disabled={room.state === "play"}
        className={`flex h-11 mt-2 font-bold bg-white p-2 border-2 rounded-full ${
          room.state === "play"
            ? "border-red-600 text-red-600"
            : "border-green-600 text-green-600"
        }`}
      >
        <p className="basis-1/4">
          {room.state === "play" ? m("playing") : m("waiting")}
        </p>

        <p className="basis-1/2">{room.name}</p>

        <div className="basis-1/4 flex justify-center">
          <p className="relative">
            <Image
              className="absolute right-[calc(100%+8px)] top-[calc(50%-8px)]"
              src={lockImage.src}
              alt="locked"
              width={16}
              height={16}
            />
            {room.currentCount}/{room.maxCount}
          </p>
        </div>
      </button>
    </>
  );
};

export default EnterRoomBtn;
