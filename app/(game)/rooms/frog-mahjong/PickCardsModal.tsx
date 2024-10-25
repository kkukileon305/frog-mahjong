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

  const currentUser = users.find((u) => u.id === Number(userID))!;
  const nokoriCardsLength = 6 - (currentUser?.cards?.length || 0);

  const allUserCardIds = users
    ?.map((user) => (user.cards ? user.cards.map((card) => card.cardID) : []))
    .flat();

  const allUserPickedCardIds = users
    ?.map((user) =>
      user.pickedCards ? user.pickedCards.map((card) => card.cardID) : []
    )
    .flat();

  const allUserCardWithoutPickedCardIds = allUserCardIds.filter(
    (id) => !allUserPickedCardIds.includes(id)
  );

  const allUserDiscardedIds = users
    ?.map((user) =>
      user.discardedCards ? user.discardedCards.map((card) => card.cardID) : []
    )
    .flat();

  const leftCardsWithoutPicked = cards.map((card) =>
    allUserCardWithoutPickedCardIds?.includes(card.id) ||
    allUserDiscardedIds?.includes(card.id)
      ? { ...card, isValid: false }
      : card
  );

  const leftCards: LeftCard[] = leftCardsWithoutPicked.map((card) => ({
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
          number: nokoriCardsLength,
        })}
      </p>
      <div className="w-full h-[calc(100dvh-96px)] grid grid-cols-11 grid-rows-4 gap-1 lg:gap-2">
        {leftCards.map((card) =>
          card.isValid ? (
            <div
              key={card.id}
              className="w-full h-full flex justify-center items-center"
            >
              <button
                className={`h-full aspect-[63/111] relative ${
                  card.picked
                    ? "border-2 border-red-400"
                    : nokoriCardsLength === 0
                    ? "grayscale"
                    : "border-red-400"
                }`}
                onClick={() => pickCard(card)}
                disabled={nokoriCardsLength === 0 || !!card.picked}
              >
                <img
                  className={`object-fill ${
                    (nokoriCardsLength === 0 || !!card.picked) && "grayscale"
                  }`}
                  src={Sealed.src}
                  alt={"sealed card"}
                />
                {card.picked && (
                  <p className="absolute top-[calc(50%-8px)] w-full text-center">
                    {card.picked.name}
                  </p>
                )}
              </button>
            </div>
          ) : (
            <div key={card.id} className="w-full h-full"></div>
          )
        )}
      </div>
    </div>
  );
};

export default PickCardsModal;
