"use client";

import { MouseEventHandler, useState } from "react";
import CreateRoomForm from "@/app/(game)/rooms/CreateRoomForm";
import ModalContainer from "@/utils/ModalContainer";

const CreateRoomBtn = () => {
  const [isOpen, setIsOpen] = useState(false);

  const onOpen = () => setIsOpen(true);

  return (
    <>
      {isOpen && (
        <ModalContainer setIsOpen={setIsOpen}>
          <CreateRoomForm />
        </ModalContainer>
      )}
      <button
        className="w-full md:w-1/2 bg-blue-400 py-2 font-bold text-white rounded-xl"
        onClick={onOpen}
      >
        방 만들기
      </button>
    </>
  );
};

export default CreateRoomBtn;
