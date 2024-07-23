"use client";

import { Room } from "@/utils/axios";
import { MouseEventHandler, useState } from "react";
import EnterRoomForm from "@/app/(game)/rooms/EnterRoomForm";
import { FaLock } from "react-icons/fa";

type EnterRoomBtnProps = {
  room: Room;
};

const EnterRoomBtn = ({ room }: EnterRoomBtnProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const onOpen = () => setIsOpen(true);
  const onClose: MouseEventHandler<HTMLDivElement> = (e) => {
    if ((e.target as HTMLElement).id === "back") {
      setIsOpen(false);
    }
  };

  return (
    <>
      {isOpen && (
        <div
          id="back"
          className="absolute left-0 top-0 w-full bg-black/50 min-h-screen z-10 flex justify-center items-center"
          onClick={onClose}
        >
          <div className="max-w-xl w-full p-4 bg-white rounded shadow">
            <EnterRoomForm room={room} />
          </div>
        </div>
      )}
      <button
        onClick={onOpen}
        className="flex h-[66px] mb-4 border border-gray-700 p-2 rounded-xl items-center gap-4"
      >
        <span>{room.name} </span>
        {room.password && <FaLock />}
      </button>
    </>
  );
};

export default EnterRoomBtn;
