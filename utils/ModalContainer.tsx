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
      className="absolute left-0 top-0 w-full bg-black/50 min-h-screen z-10 flex justify-center items-center p-2"
      onClick={onClose}
    >
      <div
        className={`max-w-3xl w-full max-h-[calc(100dvh-16px)] overflow-y-auto p-4 rounded shadow ${
          isInGame ? "bg-white/50" : "bg-white"
        }`}
      >
        {children}
      </div>
    </div>
  );
};

export default ModalContainer;
