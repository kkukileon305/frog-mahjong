"use client";

import {
  Dispatch,
  MouseEventHandler,
  ReactNode,
  SetStateAction,
  useEffect,
} from "react";

type ModalContainerProps = {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
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
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.body.style.overflowY = "hidden";
    window.scrollTo(0, 0);

    return () => {
      document.body.style.overflowY = "visible";
    };
  }, []);

  return (
    <div
      className="absolute left-0 top-0 w-full bg-black/50 z-30 flex justify-center items-center p-2 modal-container"
      onClick={onClose}
    >
      <div
        className={`relative max-w-3xl w-full important-height overflow-y-auto p-4 rounded shadow ${
          isInGame ? "hanbun-white" : "bg-white"
        }`}
      >
        {children}
      </div>
    </div>
  );
};

export default ModalContainer;
