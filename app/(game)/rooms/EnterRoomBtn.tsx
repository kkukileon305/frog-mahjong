"use client";

import { Room } from "@/utils/axios";
import { FaLock } from "react-icons/fa";
import { MouseEventHandler, useState } from "react";
import { useRouter } from "next/navigation";
import EnterRoomForm from "@/app/(game)/rooms/EnterRoomForm";
import ModalContainer from "@/utils/ModalContainer";

type EnterRoomLinkProps = {
  room: Room;
};

const EnterRoomBtn = ({ room }: EnterRoomLinkProps) => {
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
        className={`flex flex-col h-[66px] mb-4 font-bold text-white p-2 rounded-xl ${
          room.state === "play" ? "bg-red-600 " : "bg-green-600 "
        }`}
      >
        <p className="flex gap-4 items-center justify-center">
          {room.name}
          {room.password && <FaLock />}
        </p>

        <div className="flex justify-between w-full">
          <p>
            {room.currentCount}/{room.maxCount}
          </p>

          <p>{room.state === "play" ? "진행중" : "대기중"}</p>
        </div>
      </button>
    </>
  );
};

export default EnterRoomBtn;
