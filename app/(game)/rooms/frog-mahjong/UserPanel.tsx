"use client";

import { motion } from "framer-motion";
import {
  LoanBody,
  LoanRequest,
  UserSocket,
} from "@/utils/constants/old-frog-mahjong/socketTypes";
import cards, { CardImage } from "@/app/(game)/rooms/quick-game/game/cards";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import ChatItem from "@/app/(game)/rooms/frog-mahjong/ChatItem";
import { AnimatePresence } from "framer";
import { useTranslations } from "next-intl";
import { getCookie } from "cookies-next";
import useSoundStore from "@/utils/stores/useSoundStore";
import ModalContainer from "@/utils/components/ModalContainer";
import ReportModal from "@/app/(game)/rooms/frog-mahjong/ReportModal";
import useProfileIconStore from "@/utils/stores/useProfileIconStore";
import useFrogMahjongStore from "@/utils/stores/frog-mahjong/useFrogMahjongStore";

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

  const { chatList, ws, gameState, isStarted } = useFrogMahjongStore();

  const gameInfo = gameState?.gameInfo;
  const roomID = gameState?.gameInfo?.roomID;

  const userID = getCookie("userID") as string;
  const currentUser = gameState?.users?.find(
    (user) => user.id === Number(userID)
  );

  const targetUserChat = chatList
    .filter((chat) => chat.userID === user?.id)
    .toReversed()[0];

  const userDiscardImages = user?.discardedCards?.map(
    (card) =>
      cards.find((cardImage) => cardImage.id === card.cardID) as CardImage
  );

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
          <div className="w-[40%] flex flex-col rounded-t-lg py-1 lg:py-2">
            <div className="flex flex-col items-center h-full">
              <div
                tabIndex={0}
                className="max-h-full max-w-full h-[calc(100%-24px)] aspect-square relative group cursor-pointer"
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
              <div className="bg-white text-black font-bold rounded w-full">
                <p className="font-bold lg:text-xl text-center">{user.name}</p>
              </div>
            </div>

            {/*마지막 버린 카드*/}
            {/*{isStarted && lastCardImage && (*/}
            {/*  <button*/}
            {/*    className="w-6 lg:w-10 border border-red-400 disabled:border-gray-400 rounded overflow-hidden"*/}
            {/*    disabled={!isLoanSelectMode}*/}
            {/*    onClick={onLoanCard}*/}
            {/*  >*/}
            {/*    <img*/}
            {/*      src={lastCardImage.imageSrc}*/}
            {/*      alt={lastCardImage.color + lastCardImage.name}*/}
            {/*      width={40}*/}
            {/*      height={58}*/}
            {/*    />*/}
            {/*  </button>*/}
            {/*)}*/}
          </div>

          <div className="w-[60%] h-full py-2">
            <div className="h-full bg-white/50 grid grid-cols-6 grid-rows-2 gap-1 p-2 rounded flex-wrap">
              {isStarted && (
                <>
                  {userDiscardImages?.map((ci) => (
                    <div
                      key={ci.id}
                      className="w-full h-full flex justify-center items-center"
                    >
                      <img
                        src={ci.imageSrc}
                        alt={ci.color + ci.name}
                        width={40}
                        height={58}
                        className={`w-full`}
                      />
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default UserPanel;
