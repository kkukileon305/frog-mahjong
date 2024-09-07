"use client";

import useEnterRoomStore from "@/utils/stores/useEnterRoomStore";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ModalContainer from "@/utils/components/ModalContainer";
import EnterRoomForm from "@/app/(game)/rooms/EnterRoomForm";

const EnterRoomBtn = () => {
  const m = useTranslations("EnterRoomBtn");

  const router = useRouter();
  const { selectedRoom, setSelectedRoom } = useEnterRoomStore();
  const [isOpen, setIsOpen] = useState(false);

  const onClick = () => {
    if (!selectedRoom) return;

    if (selectedRoom.password) {
      setIsOpen(true);
    } else {
      router.push(`/rooms/${selectedRoom.id}`);
    }
  };

  useEffect(() => {
    return () => setSelectedRoom(null);
  }, []);

  return (
    <>
      {selectedRoom && isOpen && (
        <ModalContainer setIsOpen={setIsOpen}>
          <EnterRoomForm roomID={Number(selectedRoom.id)} />
        </ModalContainer>
      )}

      <button
        onClick={onClick}
        disabled={selectedRoom == null}
        className="w-full md:basis-1/3 bg-blue-400 py-2 font-bold text-white rounded-xl disabled:text-gray-200 disabled:bg-gray-400"
      >
        {m("enter")}
      </button>
    </>
  );
};

export default EnterRoomBtn;
