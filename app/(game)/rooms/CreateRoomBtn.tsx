"use client";

import { MouseEventHandler, useState } from "react";
import CreateRoomForm from "@/app/(game)/rooms/CreateRoomForm";

const CreateRoomBtn = () => {
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
          <div className="max-w-2xl w-full p-4 bg-white rounded shadow">
            <CreateRoomForm />
          </div>
        </div>
      )}
      <button
        className="w-1/2 bg-blue-400 py-2 font-bold text-white rounded-xl"
        onClick={onOpen}
      >
        방 만들기
      </button>
    </>
  );
};

export default CreateRoomBtn;
