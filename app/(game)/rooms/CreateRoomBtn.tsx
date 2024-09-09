"use client";

import { useState } from "react";
import CreateRoomForm from "@/app/(game)/rooms/CreateRoomForm";
import ModalContainer from "@/utils/components/ModalContainer";
import { useTranslations } from "next-intl";
import { FormMetadata } from "@/utils/axios";

const CreateRoomBtn = ({ formMetadata }: { formMetadata: FormMetadata }) => {
  const m = useTranslations("CreateRoomBtn");

  const [isOpen, setIsOpen] = useState(false);

  const onOpen = () => setIsOpen(true);

  return (
    <>
      {isOpen && (
        <ModalContainer setIsOpen={setIsOpen}>
          <CreateRoomForm formMetadata={formMetadata} />
        </ModalContainer>
      )}
      <button
        className="w-full md:basis-1/3 bg-blue-400 py-2 font-bold text-white rounded-xl"
        onClick={onOpen}
      >
        {m("title")}
      </button>
    </>
  );
};

export default CreateRoomBtn;
