"use client";

import {
  Dispatch,
  MouseEventHandler,
  ReactNode,
  SetStateAction,
  useEffect,
} from "react";
import useBlockScroll from "@/utils/hooks/useBlockScroll";

type ModalContainerProps = {
  setIsOpen?:
    | Dispatch<SetStateAction<boolean>>
    | ((isOpenResultModal: boolean) => void);
  children: ReactNode;
  isInGame?: boolean;
};

const ModalContainer = ({
  setIsOpen,
  children,
  isInGame = false,
}: ModalContainerProps) => {
  const onClose: MouseEventHandler<HTMLDivElement> = (e) => {
    if ((e.target as HTMLElement).id === "back") {
      setIsOpen && setIsOpen(false);
    }
  };

  useBlockScroll();

  return (
    <div
      className="absolute left-0 top-0 w-full h-[calc(100dvh)] bg-black/50 z-30 flex justify-center items-center p-2"
      onClick={onClose}
    >
      <div
        className={`relative max-w-3xl w-full max-h-[calc(100dvh-16px)] overflow-y-auto p-4 rounded shadow ${
          isInGame ? "bg-white/50" : "bg-white"
        }`}
      >
        {children}
      </div>
    </div>
  );
};

export default ModalContainer;
