import React from "react";
import { useTranslations } from "next-intl";

type WarningModalProps = {
  direction?: string;
  jaDirection?: string;
};

const WarningModal = ({
  direction = "가로",
  jaDirection = "横",
}: WarningModalProps) => {
  const m = useTranslations("Warning");

  return (
    <div className="flex h-[calc(100dvh-48px)] justify-center items-center">
      <div className="p-4 w-full max-w-3xl rounded-xl flex justify-center items-center">
        <p className="font-bold text-3xl text-center">
          {m.rich("title", {
            br: (c) => <br />,
            direction,
            jaDirection,
          })}
        </p>
      </div>
    </div>
  );
};

export default WarningModal;
