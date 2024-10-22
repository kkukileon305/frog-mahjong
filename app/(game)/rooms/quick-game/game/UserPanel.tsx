"use client";

import { motion } from "framer-motion";
import {
  LoanBody,
  LoanRequest,
  UserSocket,
} from "@/utils/constants/old-frog-mahjong/socketTypes";
import cards, { CardImage } from "@/app/(game)/rooms/quick-game/game/cards";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import ChatItem from "@/app/(game)/rooms/quick-game/game/ChatItem";
import { AnimatePresence } from "framer";
import { useTranslations } from "next-intl";
import useOldFrogMahjongStore from "@/utils/stores/old-frog-mahjong/useOldFrogMahjongStore";
import { getCookie } from "cookies-next";
import useSoundStore from "@/utils/stores/useSoundStore";
import ModalContainer from "@/utils/components/ModalContainer";
import ReportModal from "@/app/(game)/rooms/quick-game/ReportModal";
import useProfileIconStore from "@/utils/stores/useProfileIconStore";

type UserPanelProps = {
  user?: UserSocket;
  isLoanSelectMode: boolean;
  setIsLoanSelectMode: Dispatch<SetStateAction<boolean>>;
  setIsLoanEnd: Dispatch<SetStateAction<boolean>>;
  place?: "left" | "right";
};

const UserPanel = ({
  user,
  isLoanSelectMode,
  setIsLoanSelectMode,
  setIsLoanEnd,
  place = "left",
}: UserPanelProps) => {
  const m = useTranslations("UserPanel");
  const audios = useSoundStore((s) => s.audios);
  const profileIcons = useProfileIconStore((s) => s.profileIcons);

  const userIcon = profileIcons.find(
    (icon) => icon.profileID === user?.profileID
  )!;

  const [reportModalOpen, setReportModalOpen] = useState(false);

  const { chatList, ws, gameState, isStarted } = useOldFrogMahjongStore();

  const gameInfo = gameState?.gameInfo;
  const roomID = gameState?.gameInfo?.roomID;

  const userID = getCookie("userID") as string;
  const currentUser = gameState?.users?.find(
    (user) => user.id === Number(userID)
  );

  const targetUserChatList = chatList
    .filter((chat) => chat.userID === user?.id && chat.valid)
    .toReversed();

  const lastCard =
    user?.discardedCards &&
    user?.discardedCards[user.discardedCards.length - 1];
  const lastCardImage = cards.find((ci) => ci.id === lastCard?.cardID);

  const userDiscardImages = user?.discardedCards?.map(
    (card) =>
      cards.find((cardImage) => cardImage.id === card.cardID) as CardImage
  );

  const onLoanCard = () => {
    if (
      gameInfo?.loanInfo === null &&
      isLoanSelectMode &&
      user?.discardedCards
    ) {
      const lastCard = user.discardedCards[user.discardedCards.length - 1];

      const requestBody: LoanBody = {
        cardID: lastCard.cardID,
        playTurn: gameInfo?.playTurn,
        targetUserID: user?.id!,
      };

      const request: LoanRequest = {
        roomID: Number(roomID),
        message: JSON.stringify(requestBody),
        event: "LOAN",
      };

      ws?.send(JSON.stringify(request));

      setIsLoanEnd(true);
      setIsLoanSelectMode(false);

      audios?.cardChapAudio.play();
    }
  };

  useEffect(() => {
    if (gameInfo?.loanInfo) {
      setIsLoanSelectMode(false);
    }
  }, [gameInfo?.loanInfo]);

  const isActive = gameInfo?.loanInfo
    ? gameInfo.loanInfo.userID === user?.id
    : user?.turnNumber === gameInfo?.playTurn && isStarted;

  if (!user) {
    return <div className="h-1/2" />;
  }

  if (user.id === currentUser?.id) {
    return (
      <div className="relative w-full h-1/2">
        <ul className="absolute right-full text-black top-0 w-40 h-fit overflow-hidden z-20">
          <AnimatePresence>
            {targetUserChatList.map((chat) => (
              <ChatItem key={chat.chatID} chat={chat} place={place} />
            ))}
          </AnimatePresence>
        </ul>

        <div className="overflow-hidden border-2 lg:border-4 flex flex-col bg-white/20 border-white rounded-xl text-white w-full h-full">
          <div
            className={`flex items-center justify-between w-full px-2 py-1 lg:py-2 ${
              isActive && "bg-red-500"
            }`}
          >
            <div className="flex items-center gap-2">
              <div className="w-8 lg:w-12 aspect-square relative border-white border rounded-lg overflow-hidden">
                {userIcon ? (
                  <img src={userIcon.image} alt={user.name} />
                ) : (
                  <div>x</div>
                )}
              </div>
              <div>
                <p className="font-bold text-[10px] lg:text-xl">{user.name}</p>
                <p className="font-bold text-[10px] lg:text-xl">
                  {user.coin} Point
                </p>
              </div>
            </div>

            {isStarted && lastCardImage && (
              <img
                src={lastCardImage.imageSrc}
                alt={lastCardImage.color + lastCardImage.name}
                className={`w-6 lg:w-10 aspect-[4/7] ${
                  isLoanSelectMode && "hover:bg-white/50"
                }`}
              />
            )}
          </div>

          <div className="w-full overflow-y-auto flex justify-start gap-1 p-2 rounded flex-wrap">
            {isStarted &&
              userDiscardImages?.map((ci) => (
                <div key={ci.id} className="w-[calc((100%-28px)/8)] h-fit">
                  <img
                    src={ci.imageSrc}
                    alt={ci.color + ci.name}
                    width={40}
                    height={58}
                    className="w-full"
                  />
                </div>
              ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {reportModalOpen && (
        <ModalContainer setIsOpen={setReportModalOpen}>
          <ReportModal
            targetUserID={user.id}
            setReportModalOpen={setReportModalOpen}
          />
        </ModalContainer>
      )}
      <div className="relative w-full h-1/2">
        <ul
          className={`absolute top-0 text-black w-40 z-20 h-fit overflow-hidden ${
            place === "left" ? "left-full" : "right-full"
          }`}
        >
          <AnimatePresence>
            {targetUserChatList.map((chat) => (
              <ChatItem key={chat.chatID} chat={chat} place={place} />
            ))}
          </AnimatePresence>
        </ul>

        <motion.div
          initial={{
            opacity: 0,
            y: 30,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          exit={{
            opacity: 0,
            y: 30,
          }}
          className="border-2 lg:border-4 flex flex-col bg-white/20 border-white rounded-xl text-white h-full"
        >
          <div
            className={`flex items-center justify-between w-full rounded-t-lg px-2 py-1 lg:py-2 ${
              isActive && "bg-red-500"
            }`}
          >
            <div className="flex items-center gap-2">
              <div
                tabIndex={0}
                className="w-8 lg:w-12 aspect-square relative group cursor-pointer"
              >
                {userIcon ? (
                  <img
                    className=" border-white border rounded-lg"
                    src={userIcon.image}
                    alt={user.name}
                  />
                ) : (
                  <div>x</div>
                )}

                <div className="absolute top-[calc(100%+4px)] left-[calc(50%-10px)] flex-col drop-shadow-lg invisible group-focus:visible flex cursor-default opacity-0 group-focus:opacity-100 duration-100">
                  <div className="w-0 h-0 border-l-[10px] border-l-transparent border-b-[15px] border-b-white border-r-[10px] border-r-transparent" />
                  <div
                    className="bg-white w-[120px] lg:w-[240px] rounded -translate-x-2 text-black"
                    onClick={(e) => e.preventDefault()}
                  >
                    <div className="text-xs lg:text-base p-2 border-b">
                      <p className="font-bold">{user.name}</p>
                      <span className="">{user.email}</span>
                    </div>
                    <div
                      onClick={() => setReportModalOpen(true)}
                      className="text-xs lg:text-base cursor-pointer p-2 font-bold text-red-500 hover:bg-gray-400"
                    >
                      <p>{m("report")}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <p className="font-bold text-[10px] lg:text-xl">{user.name}</p>
                <p className="font-bold text-[10px] lg:text-xl">
                  {user.coin} Point
                </p>
              </div>
            </div>

            {isStarted && lastCardImage && (
              <button
                className="w-6 lg:w-10 border border-red-400 disabled:border-gray-400 rounded overflow-hidden"
                disabled={!isLoanSelectMode}
                onClick={onLoanCard}
              >
                <img
                  src={lastCardImage.imageSrc}
                  alt={lastCardImage.color + lastCardImage.name}
                  width={40}
                  height={58}
                />
              </button>
            )}
          </div>
          <div className="w-full overflow-y-auto flex gap-1 p-2 rounded flex-wrap">
            {isStarted &&
              userDiscardImages?.map((ci) => (
                <div key={ci.id} className="w-[calc((100%-28px)/8)] h-fit">
                  <img
                    src={ci.imageSrc}
                    alt={ci.color + ci.name}
                    width={40}
                    height={58}
                    className={`w-full ${
                      isLoanSelectMode && "hover:bg-white/50"
                    }`}
                  />
                </div>
              ))}
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default UserPanel;
