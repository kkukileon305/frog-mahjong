"use client";

import { Room } from "@/utils/axios";
import { FaLock } from "react-icons/fa";
import { MouseEventHandler, useState } from "react";
import { useRouter } from "next/navigation";
import EnterRoomForm from "@/app/(game)/rooms/EnterRoomForm";

type EnterRoomLinkProps = {
  room: Room;
};

const EnterRoomBtn = ({ room }: EnterRoomLinkProps) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const onClose: MouseEventHandler<HTMLDivElement> = (e) => {
    if ((e.target as HTMLElement).id === "back") {
      setIsOpen(false);
    }
  };

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
        <div
          className="absolute left-0 top-0 w-full bg-black/50 min-h-screen z-10 flex justify-center items-center"
          onClick={onClose}
        >
          <div className="max-w-2xl w-full p-4 bg-white rounded shadow">
            <EnterRoomForm roomID={room.id} />
          </div>
        </div>
      )}

      <button
        onClick={onClick}
        className="flex flex-col h-[66px] mb-4 border border-gray-700 p-2 rounded-xl"
      >
        <p className="flex gap-4 items-center justify-center">
          {room.name}
          {room.password && <FaLock />}
        </p>

        <div className="flex justify-between w-full">
          <p>
            {room.currentCount}/{room.maxCount}
          </p>

          <p>{room.state}</p>
        </div>
      </button>
    </>
  );
};

export default EnterRoomBtn;
