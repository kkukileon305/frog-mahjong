"use client";

import {
  DiscardBody,
  DiscardRequest,
  GameInfo,
  UserSocket,
} from "@/utils/socketTypes";
import cards, { CardImage } from "@/app/(game)/rooms/[roomID]/game/cards";
import Image from "next/image";
import MyCardList from "@/app/(game)/rooms/[roomID]/game/MyCardList";
import { Dispatch, SetStateAction } from "react";

type MyCardProps = {
  currentUser?: UserSocket;
  isUserTurn: boolean;
  gameInfo: GameInfo | null;
  roomID: string;
  ws: null | WebSocket;
  discardMode: boolean;
  setDiscardMode: Dispatch<SetStateAction<boolean>>;
};

const MyCardBoard = ({
  currentUser,
  isUserTurn,
  gameInfo,
  roomID,
  ws,
  discardMode,
  setDiscardMode,
}: MyCardProps) => {
  // list 컴포넌트 분리하여 무한반복 해결
  const userCardImages = currentUser?.cards?.map(
    (card) =>
      cards.find((cardImage) => cardImage.id === card.cardID) as CardImage
  );

  const isFullSixCard = currentUser?.cards?.length === 6;

  const userDiscardImages = currentUser?.discardedCards?.map(
    (card) =>
      cards.find((cardImage) => cardImage.id === card.cardID) as CardImage
  );

  const handleDiscard = (ci: CardImage) => {
    if (isFullSixCard) {
      const body: DiscardBody = {
        cardID: ci.id,
        playTurn: gameInfo?.playTurn as number,
      };

      const request: DiscardRequest = {
        userID: currentUser?.id,
        event: "DISCARD",
        roomID: Number(roomID),
        message: JSON.stringify(body),
      };

      ws?.send(JSON.stringify(request));
      setDiscardMode(false);
    }
  };

  return (
    <div
      className={`relative h-[160px] border-r border-t border-black flex justify-center items-center gap-4 ${
        isUserTurn ? "bg-red-400" : "bg-gray-400"
      }`}
    >
      <div className="flex flex-col items-center gap-2">
        {/* TODO: 드래그해서 조합 확인해볼 수 있게 */}

        <div className="min-w-[60px] flex items-center h-[80px] border p-2 rounded">
          {userCardImages ? (
            <MyCardList
              userCardImages={userCardImages}
              discardMode={discardMode}
              handleDiscard={handleDiscard}
            />
          ) : (
            <p className="text-center">
              아직 가진 패가 <br /> 없습니다
            </p>
          )}
        </div>

        <p>가진 패</p>
      </div>

      <div className="flex flex-col items-center gap-2">
        <div className="min-w-[60px] flex items-center gap-2 h-[80px] border p-2 rounded">
          {userDiscardImages ? (
            userDiscardImages?.map((ci) => (
              <Image
                src={ci.imageSrc}
                alt={ci.color + ci.name}
                key={ci.id}
                width={40}
                height={58}
              />
            ))
          ) : (
            <p className="text-center">
              아직 버린 패가 <br /> 없습니다
            </p>
          )}
        </div>

        <p>버린 패</p>
      </div>
    </div>
  );
};

export default MyCardBoard;
