"use client";

import { motion } from "framer-motion";
import { UserSocket } from "@/utils/constants/old-frog-mahjong/socketTypes";
import React, { useState } from "react";
import { AnimatePresence } from "framer";
import { useTranslations } from "next-intl";
import { getCookie } from "cookies-next";
import useSoundStore from "@/utils/stores/useSoundStore";
import ModalContainer from "@/utils/components/ModalContainer";
import ReportModal from "@/app/(game)/rooms/frog-mahjong/ReportModal";
import useProfileIconStore from "@/utils/stores/useProfileIconStore";
import useFrogMahjongStore from "@/utils/stores/frog-mahjong/useFrogMahjongStore";
import RedOne from "@/public/cards/red_one.png";

type UserPanelProps = {
  user?: UserSocket;
};

const UserPanel = ({ user }: UserPanelProps) => {
  const m = useTranslations("UserPanel");
  const audios = useSoundStore((s) => s.audios);
  const profileIcons = useProfileIconStore((s) => s.profileIcons);

  const userIcon = profileIcons.find(
    (icon) => icon.profileID === user?.profileID
  )!;

  const [reportModalOpen, setReportModalOpen] = useState(false);

  const { chatList, ws, gameState, isStarted, cards } = useFrogMahjongStore();

  const gameInfo = gameState?.gameInfo;
  const roomID = gameState?.gameInfo?.roomID;

  const userID = getCookie("userID") as string;
  const currentUser = gameState?.users?.find(
    (user) => user.id === Number(userID)
  );

  const targetUserChat = chatList
    .filter((chat) => chat.userID === user?.id)
    .toReversed()[0];

  const userDiscardImages = user?.discardedCards?.map((card) =>
    cards.find((cardImage) => cardImage.id === card.cardID)
  );

  const userLastDiscardImage = userDiscardImages?.toReversed()[0];

  if (!user) {
    return <div className="h-full" />;
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

      <div className="relative w-full h-full">
        {/* TODO:ChatList*/}
        {/*<ul*/}
        {/*  className={`absolute top-0 text-black w-40 z-20 h-fit overflow-hidden left-full`}*/}
        {/*>*/}
        {/*  <AnimatePresence>*/}
        {/*    {targetUserChatList.map((chat) => (*/}
        {/*      <ChatItem key={chat.chatID} chat={chat} />*/}
        {/*    ))}*/}
        {/*  </AnimatePresence>*/}
        {/*</ul>*/}

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
          className="flex text-white h-full"
        >
          <div className="w-full flex flex-col rounded-t-lg py-1 lg:py-2">
            <div className="flex flex-col items-center h-full">
              <div
                tabIndex={0}
                className="h-[calc((100%-24px)/2)] p-1 aspect-square relative group cursor-pointer"
              >
                {userIcon ? (
                  <img
                    className="w-full aspect-square object-cover object-bottom"
                    src={userIcon.image}
                    alt={user.name}
                  />
                ) : (
                  <div>icon</div>
                )}

                {/* chat */}
                <AnimatePresence>
                  {targetUserChat?.valid && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 100 }}
                      exit={{ opacity: 0 }}
                      className="absolute bottom-[calc(100%+4px)] left-[calc(50%-10px)] flex-col drop-shadow-lg flex cursor-default "
                    >
                      <div
                        className="bg-white lg:w-[240px] rounded -translate-x-2 text-black p-1"
                        onClick={(e) => e.preventDefault()}
                      >
                        {targetUserChat.message}
                      </div>
                      <div className="w-0 h-0 border-l-[10px] border-l-transparent border-t-[15px] border-t-white border-r-[10px] border-r-transparent" />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* 드롭다운 유저 메뉴 */}
                {/*<div className="absolute top-[calc(100%+4px)] left-[calc(50%-10px)] flex-col drop-shadow-lg invisible group-focus:visible flex cursor-default opacity-0 group-focus:opacity-100 duration-100">*/}
                {/*  <div className="w-0 h-0 border-l-[10px] border-l-transparent border-b-[15px] border-b-white border-r-[10px] border-r-transparent" />*/}
                {/*  <div*/}
                {/*    className="bg-white w-[120px] lg:w-[240px] rounded -translate-x-2 text-black"*/}
                {/*    onClick={(e) => e.preventDefault()}*/}
                {/*  >*/}
                {/*    <div className="text-xs lg:text-base p-2 border-b">*/}
                {/*      <p className="font-bold">{user.name}</p>*/}
                {/*      <span className="">{user.email}</span>*/}
                {/*    </div>*/}
                {/*    <div*/}
                {/*      onClick={() => setReportModalOpen(true)}*/}
                {/*      className="text-xs lg:text-base cursor-pointer p-2 font-bold text-red-500 hover:bg-gray-400"*/}
                {/*    >*/}
                {/*      <p>{m("report")}</p>*/}
                {/*    </div>*/}
                {/*  </div>*/}
                {/*</div>*/}
              </div>

              <div className="px-4 text-black font-bold w-full">
                <p className="bg-white font-bold rounded lg:text-xl text-center">
                  {user.name}
                </p>
              </div>

              {isStarted && userLastDiscardImage && (
                <button className="w-full border border-red-400 disabled:border-gray-400 rounded overflow-hidden">
                  <img
                    src={userLastDiscardImage.image}
                    alt={userLastDiscardImage.name}
                    width={40}
                    height={58}
                  />
                </button>
              )}

              <img
                src={RedOne.src}
                alt={"asd"}
                className="h-[calc((100%-24px)/2)] m-1 aspect-[63/111] border-4 border-[#796858] rounded overflow-hidden"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default UserPanel;
