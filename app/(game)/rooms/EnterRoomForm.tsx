"use client";

import CancelMatchBtn from "@/app/(game)/rooms/CancelMatchBtn";
import { useTranslations } from "next-intl";
import useQuickMatching, { MatchingMode } from "@/utils/hooks/useQuickMatching";
import { Dispatch, SetStateAction, useEffect } from "react";

type CancelMatchBtnProps = {
  mode: MatchingMode;
  setOpenMatchModal: Dispatch<SetStateAction<MatchingMode | null>>;
};

const EnterRoomForm = ({ mode, setOpenMatchModal }: CancelMatchBtnProps) => {
  const m = useTranslations("MatchingModal");
  const connect = useQuickMatching(mode);

  useEffect(() => {
    connect();
  }, []);

  return (
    <div className="absolute left-0 top-0 w-full h-[calc(100dvh)] bg-black/50 z-30 flex justify-center items-center p-2">
      <div className="relative max-w-3xl w-full max-h-[calc(100dvh-16px)] overflow-y-auto py-8 px-4 shadow bg-green-500 rounded-xl">
        <h3 className="font-bold text-white text-center text-4xl mb-8">
          {m(mode)}
        </h3>
        <div className="bg-white flex flex-col items-center gap-8 rounded-xl py-8">
          {mode === "NORMAL" && (
            <>
              <p className="text-center text-3xl font-bold">{m("search")}</p>
              <CancelMatchBtn setOpenMatchModal={setOpenMatchModal} />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default EnterRoomForm;
