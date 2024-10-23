"use client";

import useFrogMahjongStore from "@/utils/stores/frog-mahjong/useFrogMahjongStore";
import Sealed from "@/public/cards/sealed.jpg";
import { useTranslations } from "next-intl";
import { CardImage } from "@/app/(game)/rooms/quick-game/game/cards";
import {
  ImportSingleCardBody,
  ImportSingleCardRequest,
  UserSocket,
} from "@/utils/constants/frog-mahjong/socketTypes";
import { getCookie } from "cookies-next";

type LeftCard = CardImage & {
  picked: null | UserSocket;
};

const PickCardsModal = () => {
  const m = useTranslations("PickCardsModal");

  const userID = getCookie("userID") as string;
  const accessToken = getCookie("accessToken") as string;

  const { cards, users, ws, playTurn, roomID } = useFrogMahjongStore((s) => ({
    cards: s.cards,
    users: s.gameState?.users!,
    ws: s.ws,
    playTurn: s.gameState?.gameInfo?.playTurn!,
    roomID: s.gameState?.gameInfo?.roomID!,
  }));

  const leftCards: LeftCard[] = cards.map((card) => ({
    ...card,
    picked:
      users.find((user) =>
        user.pickedCards?.find((pc) => pc.cardID === card.id)
      ) || null,
  }));

  const pickCard = (card: LeftCard) => {
    const body: ImportSingleCardBody = {
      cardID: card.id,
      playTurn,
    };

    const request: ImportSingleCardRequest = {
      userID: Number(userID),
      event: "IMPORT_SINGLE_CARD",
      message: JSON.stringify(body),
      roomID,
    };

    ws?.send(JSON.stringify(request));
  };

  return (
    <div className="w-full max-h-[500px] h-[calc(100dvh-64px)] flex flex-col">
      <p className="mb-2 text-center">
        {m("title", {
          number: 6,
        })}
      </p>
      <div className="w-full h-[calc(100dvh-96px)] grid grid-cols-11 grid-rows-4 gap-1 lg:gap-2">
        {leftCards.map((card) => (
          <div
            key={card.id}
            className="w-full h-full flex justify-center items-center"
          >
            <button
              className="h-full aspect-[63/111] relative"
              onClick={() => pickCard(card)}
              disabled={!!card.picked}
            >
              <img
                className="object-fill"
                src={Sealed.src}
                alt={"sealed card"}
              />
              {card.picked && (
                <p className="absolute top-0">{card.picked.name}</p>
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PickCardsModal;
