"use client";

import { motion } from "framer-motion";
import {
  GameInfo,
  LoanBody,
  LoanRequest,
  RoomOutBody,
  RoomOutRequest,
  UserSocket,
} from "@/utils/socketTypes";
import cards, { CardImage } from "@/app/(game)/rooms/[roomID]/game/cards";
import Image from "next/image";
import { Dispatch, SetStateAction, useEffect } from "react";
import { FaChessQueen } from "react-icons/fa6";

type OtherCard = {
  user?: UserSocket;
  playTurn?: number;
  isLoanSelectMode: boolean;
  setIsLoanSelectMode: Dispatch<SetStateAction<boolean>>;
  ws: null | WebSocket;
  gameInfo: GameInfo | null;
  roomID: number;
  setIsLoanEnd: Dispatch<SetStateAction<boolean>>;
  currentUser: UserSocket;
  isStarted: boolean;
};

const UserPanel = ({
  user,
  ws,
  gameInfo,
  isLoanSelectMode,
  setIsLoanSelectMode,
  roomID,
  setIsLoanEnd,
  currentUser,
  isStarted,
}: OtherCard) => {
  // TODO: 강퇴기능

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
        roomID,
        message: JSON.stringify(requestBody),
        event: "LOAN",
      };

      ws?.send(JSON.stringify(request));

      setIsLoanEnd(true);
      setIsLoanSelectMode(false);
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

  const onClick = () => {
    const body: RoomOutBody = {
      targetUserID: user.id,
    };

    const request: RoomOutRequest = {
      userID: currentUser.id,
      roomID: Number(roomID),
      event: "ROOM_OUT",
      message: JSON.stringify(body),
    };

    ws?.send(JSON.stringify(request));
  };

  if (user.id === currentUser.id) {
    return (
      <div className="border-4 flex flex-col overflow-hidden bg-white/20 border-white rounded-xl text-white w-full h-1/2">
        <div
          className={`flex items-center justify-between w-full p-2 ${
            isActive && "bg-red-500"
          }`}
        >
          <div className="flex items-center gap-2">
            <div className="w-12 h-12 relative border-white border rounded-full">
              {user.isOwner && (
                <FaChessQueen className="absolute right-0 top-0" />
              )}
            </div>
            <div>
              <p className="font-bold text-xl">{user.name}</p>
              <p>{user.coin} Point</p>
            </div>
          </div>

          {!user.isOwner && user.playerState !== "play" && (
            <p className="font-bold text-xl">
              {user.playerState === "ready" ? "준비" : "대기"}
            </p>
          )}

          {isStarted && lastCardImage && (
            <Image
              src={lastCardImage.imageSrc}
              alt={lastCardImage.color + lastCardImage.name}
              width={40}
              height={58}
              className={`${isLoanSelectMode && "hover:bg-white/50"}`}
            />
          )}
        </div>

        <div className="w-[296px] h-1/2 flex gap-2 p-2 rounded flex-wrap">
          {isStarted &&
            userDiscardImages?.map((ci) => (
              <div key={ci.id}>
                <Image
                  src={ci.imageSrc}
                  alt={ci.color + ci.name}
                  width={40}
                  height={58}
                />
              </div>
            ))}
        </div>
      </div>
    );
  }

  return (
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
      className="border-4 flex flex-col overflow-hidden bg-white/20 border-white rounded-xl text-white w-full h-1/2"
    >
      <div
        className={`flex items-center justify-between w-full p-2 ${
          isActive && "bg-red-500"
        }`}
      >
        <div className="flex items-center gap-2">
          <div className="w-12 h-12 relative border-white border rounded-full">
            {user.isOwner && (
              <FaChessQueen className="absolute right-0 top-0" />
            )}
          </div>
          <div>
            <p className="font-bold text-xl">{user.name}</p>
            <p>{user.coin} Point</p>
          </div>
        </div>

        {!user.isOwner && user.playerState !== "play" && (
          <p className="font-bold text-xl">
            {user.playerState === "ready" ? "준비" : "대기"}
          </p>
        )}

        {isStarted && lastCardImage && (
          <button disabled={!isLoanSelectMode} onClick={onLoanCard}>
            <Image
              src={lastCardImage.imageSrc}
              alt={lastCardImage.color + lastCardImage.name}
              width={40}
              height={58}
            />
          </button>
        )}
      </div>
      <div className="w-[296px] h-1/2 flex gap-2 p-2 rounded flex-wrap">
        {isStarted &&
          userDiscardImages?.map((ci) => (
            <div key={ci.id}>
              <Image
                src={ci.imageSrc}
                alt={ci.color + ci.name}
                width={40}
                height={58}
                className={` ${isLoanSelectMode && "hover:bg-white/50"}`}
              />
            </div>
          ))}
      </div>

      {!isStarted && currentUser.isOwner && user.id !== currentUser.id && (
        <button
          onClick={onClick}
          className="text-black px-1 rounded-xl bg-white text-sm"
        >
          강퇴
        </button>
      )}
    </motion.div>
  );
};

export default UserPanel;
