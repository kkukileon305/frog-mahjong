"use client";

import { Room } from "@/utils/axios";
import { useState } from "react";
import EnterRoomForm from "@/app/(game)/rooms/EnterRoomForm";
import ModalContainer from "@/utils/components/ModalContainer";
import { useTranslations } from "next-intl";
import lockImage from "@/public/icons/lock.png";
import Image from "next/image";
import useEnterRoomStore from "@/utils/stores/useEnterRoomStore";

type EnterRoomLinkProps = {
  room: Room;
};

const RoomBtn = ({ room }: EnterRoomLinkProps) => {
  const m = useTranslations("RoomBtn");

  const { setSelectedRoom, selectedRoom } = useEnterRoomStore();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {isOpen && (
        <ModalContainer setIsOpen={setIsOpen}>
          <EnterRoomForm roomID={room.id} />
        </ModalContainer>
      )}

      <button
        onClick={() => setSelectedRoom(selectedRoom ? null : room)}
        disabled={room.state === "play"}
        className={`flex h-11 mt-2 font-bold p-2 border-2 rounded-full ${
          room.state === "play"
            ? "border-red-600 text-red-600"
            : "border-green-600 text-green-600"
        } ${room.id === selectedRoom?.id ? "bg-green-400" : "bg-white"}`}
      >
        <p className="basis-1/4">
          {room.state === "play" ? m("playing") : m("waiting")}
        </p>

        <p className="basis-1/2">{room.name}</p>

        <div className="basis-1/4 flex justify-center">
          <p className="relative">
            {room.password && (
              <Image
                className="absolute right-[calc(100%+8px)] top-[calc(50%-8px)]"
                src={lockImage.src}
                alt="locked"
                width={16}
                height={16}
              />
            )}
            {room.currentCount}/{room.maxCount}
          </p>
        </div>
      </button>
    </>
  );
};

export default RoomBtn;
