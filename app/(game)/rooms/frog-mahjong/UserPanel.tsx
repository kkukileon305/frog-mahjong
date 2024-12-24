"use client";

import { motion } from "framer-motion";
import { UserSocket } from "@/utils/constants/frog-mahjong/socketTypes";
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
import getEmojiFromName from "@/utils/functions/getEmojiFromName";

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
                  <div className="relative w-full aspect-square border-[3px] border-[#F19830] rounded">
                    <img
                      className="w-full aspect-square object-cover object-bottom"
                      src={userIcon.image}
                      alt={user.name}
                    />

                    <div className="w-5 h-5 flex justify-center items-center font-bold rounded-full top-0 right-0 translate-x-1/2 -translate-y-1/2 bg-[#F19830] absolute">
                      <p>{user.missionSuccessCount}</p>
                    </div>
                  </div>
                ) : (
                  <div>icon</div>
                )}

                {/* chat */}
                <AnimatePresence>
                  {targetUserChat?.valid && (
                    <motion.div
                      key={targetUserChat.message}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 100, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="absolute bottom-[calc(100%+4px)] left-[calc(50%-10px)] flex-col drop-shadow-lg flex cursor-default "
                    >
                      <div
                        className="bg-white w-8 h-8 rounded -translate-x-2 text-black p-1 flex justify-center items-center"
                        onClick={(e) => e.preventDefault()}
                      >
                        <img
                          src={getEmojiFromName(targetUserChat.message)?.src}
                          alt={targetUserChat.message}
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="px-4 text-black font-bold w-full">
                <p className="bg-white font-bold rounded lg:text-xl text-center">
                  {user.name}
                </p>
              </div>

              <div className="h-[calc((100%-24px)/2)]">
                {userLastDiscardImage && (
                  <button className="h-full overflow-hidden">
                    <img
                      src={userLastDiscardImage.image}
                      alt={userLastDiscardImage.name}
                      className="h-full"
                    />
                  </button>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default UserPanel;
