"use client";

import useWingspanStore from "@/utils/stores/wingspan/useWingspanStore";
import Timer from "@/public/icons/timer.png";
import { useTranslations } from "next-intl";
import {
  ImportSingleCardBody,
  ImportSingleCardRequest,
  ItemChangeBody,
  ItemChangeRequest,
  UserSocket,
} from "@/utils/constants/frog-mahjong/socketTypes";
import { getCookie } from "cookies-next";
import getRandomElements from "@/utils/functions/getRandomElements";
import { BirdCard } from "@/utils/axios";
import { useEffect } from "react";
import { RANDOM } from "@/utils/constants/const";
import { getSuccessCardIds } from "@/utils/functions/frog-mahjong/checkMissions";
import { encryptAES } from "@/utils/functions/aes";

type LeftCard = BirdCard & {
  picked: null | UserSocket;
};

type PickCardsModalProps = {
  inGame?: boolean;
};

const PickCardsModal = ({ inGame = false }: PickCardsModalProps) => {
  const m = useTranslations("PickCardsModal");
  const gameM = useTranslations("Game");

  const userID = getCookie("userID") as string;
  const accessToken = getCookie("accessToken") as string;

  const gameStore = useWingspanStore();

  const users = gameStore.gameState?.users!;
  const playTurn = gameStore.gameState?.gameInfo?.playTurn!;
  const roomID = gameStore.gameState?.gameInfo?.roomID!;
  const openCardIds = gameStore.gameState?.gameInfo?.openCards || [];

  const missionIDs = gameStore.gameState?.gameInfo?.missionIDs;

  const currentMissions = gameStore.currentMissions;

  const currentUser = users.find((u) => u.id === Number(userID))!;

  const currentUserItems = currentUser.items;
  const currentUserCards = currentUser.cards?.map(
    (uc) => gameStore.cards.find((c) => c.id === uc.cardID)!
  );

  const nokoriCardsLength = 4 - (currentUser?.cards?.length || 0);

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

  const leftCardsWithoutPicked = gameStore.cards.filter(
    (card) =>
      !(
        allUserCardIds?.includes(card.id) ||
        allUserCardWithoutPickedCardIds?.includes(card.id) ||
        allUserDiscardedIds?.includes(card.id) ||
        openCardIds?.includes(card.id)
      )
  );

  // 뭉탱이카드
  const leftCards: LeftCard[] = leftCardsWithoutPicked.map((card) => ({
    ...card,
    picked:
      users.find((user) =>
        user.pickedCards?.find((pc) => pc.cardID === card.id)
      ) || null,
  }));

  const openCardsWithoutPicked = openCardIds.map(
    (od) => gameStore.cards.find((d) => d.id === od)!
  );

  // 열린카드
  const openCards: LeftCard[] = openCardsWithoutPicked.map((card) => ({
    ...card,
    picked:
      users.find((user) =>
        user.pickedCards?.find((pc) => pc.cardID === card.id)
      ) || null,
  }));

  const pickCard = async (card: LeftCard) => {
    if (!gameStore.pickable.isPickable) {
      return;
    }

    const message: ImportSingleCardBody = {
      cardID: card.id,
      playTurn,
    };

    const encryptedMessage = await encryptAES(
      JSON.stringify(message),
      btoa(process.env.NEXT_PUBLIC_AES_KEY as string)
    );

    const request: ImportSingleCardRequest = {
      userID: Number(userID),
      event: "IMPORT_SINGLE_CARD",
      message: encryptedMessage,
      roomID,
    };

    gameStore.setPickable({
      isPickable: false,
      card,
    });
    gameStore.setIsUseItem(true);
    gameStore.ws?.send(JSON.stringify(request));
  };

  const pickCards = async () => {
    if (!gameStore.pickable.isPickable) {
      return;
    }

    const card = getRandomElements(leftCards, 1)[0];
    const message: ImportSingleCardBody = {
      cardID: card.id,
      playTurn,
    };

    const encryptedMessage = await encryptAES(
      JSON.stringify(message),
      btoa(process.env.NEXT_PUBLIC_AES_KEY as string)
    );

    const request: ImportSingleCardRequest = {
      userID: Number(userID),
      event: "IMPORT_SINGLE_CARD",
      message: encryptedMessage,
      roomID,
    };

    gameStore.setPickable({
      isPickable: false,
      card,
    });
    gameStore.setIsUseItem(true);
    gameStore.ws?.send(JSON.stringify(request));
  };

  const useFirstItem = async () => {
    const body: ItemChangeBody = {
      itemID: 1,
    };

    const encryptedMessage = await encryptAES(
      JSON.stringify(body),
      btoa(process.env.NEXT_PUBLIC_AES_KEY as string)
    );

    const req: ItemChangeRequest = {
      userID: Number(userID),
      event: "ITEM_CHANGE",
      message: encryptedMessage,
      roomID,
    };

    gameStore.ws?.send(JSON.stringify(req));
    gameStore.setIsUseItem(true);
    localStorage.setItem("item", "true");
  };

  // timer === 0 and not inGame
  useEffect(() => {
    (async () => {
      if (
        gameStore.timer === 0 &&
        !gameStore.isTimeOut &&
        nokoriCardsLength &&
        !inGame &&
        !gameStore.isGameEnd
      ) {
        const body = {
          count: nokoriCardsLength,
        };

        const encryptedMessage = await encryptAES(
          JSON.stringify(body),
          btoa(process.env.NEXT_PUBLIC_AES_KEY as string)
        );

        const req = {
          userID: Number(userID),
          roomID: Number(roomID),
          event: RANDOM,
          message: encryptedMessage,
        };

        gameStore.ws?.send(JSON.stringify(req));

        gameStore.setIsTimeOut(true);
      }
    })();
  }, [gameStore.timer]);

  if (inGame) {
    return (
      <div className="h-full py-2 px-4 bg-white/50 rounded-xl overflow-hidden">
        <p className="font-bold text-center mb-2">{m("preview")}</p>

        <div className="w-full h-[calc(100%-32px)] flex gap-2 overflow-hidden justify-center">
          <div className="w-[calc(100%-48px)] flex gap-2">
            {openCards?.map((card) => (
              <div
                key={card.id}
                className="w-full max-h-full relative aspect-[63/111] flex justify-center"
              >
                <img
                  className="aspect-[63/111] object-fill"
                  src={card.image}
                  alt={"sealed card"}
                />
              </div>
            ))}
          </div>
          <div
            className={`w-20 aspect-[205/235] relative flex justify-center items-center ${
              gameStore.timer > 5 && "grayscale"
            }`}
          >
            <img
              src={Timer.src}
              alt="timer"
              className="w-20 aspect-[205/235]"
              width={205}
              height={235}
            />
            <p className="absolute w-12 text-center font-bold text-3xl text-red-500 left-[calc(50%-24px)] top-[calc(50%-14px)]">
              {gameStore.timer >= 0 ? gameStore.timer : 0}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute w-full h-full top-0 left-0 flex justify-center items-center bg-game text-[#7F674D] z-30">
      <div className="w-full h-full p-0">
        <div
          className="w-full mx-auto h-full flex flex-col rounded-xl overflow-hidden"
          style={{
            padding: inGame ? "4px" : "8px",
          }}
        >
          <div className="w-full bg-white/50 rounded-xl p-1 border-[#796858] border-4 mb-2">
            <div className="">
              <p className="basis-1/6 text-sm bg-[#FA4E38] rounded-xl font-bold text-white text-center">
                {gameM("mission")}
              </p>

              <div className="py-2 px-4">
                {currentMissions &&
                  currentMissions.map((m, index) => (
                    <div
                      key={m.id}
                      className={`flex justify-between basis-5/6 font-bold text-xs text-black ${
                        gameStore.clearMissionIDs.includes(m.id) &&
                        "line-through"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <p>
                          {index + 1}. {m.title}
                        </p>

                        {m.image && (
                          <img src={m.image} alt="" className="w-4 h-4" />
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          <div className="w-full h-[calc(100%-116px)] flex flex-col">
            <div className="h-[calc(200%/3)] border-2 border-[#796858] bg-[#E1EDE9] rounded-xl overflow-hidden py-2 px-4">
              <p className="mb-2 font-bold text-center">
                {m("selectOpen", {
                  count: nokoriCardsLength,
                })}
              </p>

              <div className="flex flex-col h-[calc(100%-32px)] gap-4 overflow-hidden">
                <div className="h-[calc(50%-8px)] gap-4 grid grid-cols-3">
                  {openCards.map((card) => (
                    <div
                      key={card.id}
                      className="w-full h-full overflow-hidden flex justify-center items-center"
                    >
                      <button
                        className={`h-full overflow-hidden aspect-[63/111] relative ${
                          card.picked
                            ? "border-2 border-red-400"
                            : nokoriCardsLength === 0
                            ? "grayscale"
                            : "border-red-400"
                        }`}
                        onClick={() => pickCard(card)}
                        disabled={
                          nokoriCardsLength === 0 || !!card.picked || inGame
                        }
                      >
                        <img
                          className={`w-full h-full object-fill ${
                            (nokoriCardsLength === 0 || !!card.picked) &&
                            "grayscale"
                          }`}
                          src={card.image}
                          alt={"sealed card"}
                        />
                        {card.picked && (
                          <p className="absolute top-[calc(50%-8px)] w-full text-center font-bold">
                            {card.picked.name}
                          </p>
                        )}
                      </button>
                    </div>
                  ))}
                </div>

                <div className="h-[calc(50%-8px)] flex justify-center items-center gap-6 bg-[#FDF9E0] border-[#796858] border-2 rounded p-2">
                  <button
                    onClick={pickCards}
                    className="h-full aspect-[63/111] bg-[#C9F2A3] border-2 border-[#796858] rounded disabled:bg-gray-200"
                    disabled={
                      nokoriCardsLength === 0 ||
                      inGame ||
                      leftCards.length === 0
                    }
                  />
                  <div className="h-full flex flex-col items-center justify-center py-3">
                    <div
                      className={`h-[calc(100%-60px)] aspect-[205/235] relative ${
                        gameStore.timer > 5 && "grayscale"
                      }`}
                    >
                      <img
                        src={Timer.src}
                        alt="timer"
                        className="h-full aspect-[205/235]"
                        width={205}
                        height={235}
                      />
                      <p className="absolute w-10 h-7 left-[calc(50%-20px)] text-3xl text-red-500 text-center top-[calc(50%-16px)] font-bold">
                        {gameStore.timer >= 0 ? gameStore.timer : 0}
                      </p>
                    </div>
                    <div className="mt-2 flex flex-col items-center">
                      <p className="font-bold text-sm">{m("selectRandom")}</p>
                      <p
                        className="font-bold text-xl"
                        style={{
                          WebkitTextStroke: "1px #7F674D",
                          color: "white",
                        }}
                      >
                        {leftCards.length}/{gameStore.cards.length}
                      </p>
                    </div>
                  </div>

                  <div className="h-full flex flex-col items-center justify-center py-3">
                    <button
                      onClick={useFirstItem}
                      disabled={
                        gameStore.isUseItem ||
                        (currentUserItems
                          ? currentUserItems[0].remainingUses === 0
                          : true)
                      }
                      className={`h-[calc(100%-60px)] aspect-square rounded-full bg-[#FA4E38] disabled:bg-gray-200 flex justify-center items-center text-white font-bold text-3xl`}
                    >
                      ON
                    </button>

                    <div className="mt-2 flex flex-col items-center">
                      <p className="font-bold text-sm">{m("change")}</p>
                      <p
                        className="font-bold text-xl"
                        style={{
                          WebkitTextStroke: "1px #7F674D",
                          color: "white",
                        }}
                      >
                        {currentUserItems
                          ? currentUserItems[0].remainingUses
                          : 0}
                        /3
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="h-[calc((100%-8px)/3)] mt-2 border-2 border-[#796858] bg-[#ECC7C1] rounded-xl overflow-hidden p-2">
              <p className="font-bold text-center mb-2">
                {m("myCard")}
                <span className="ml-4">{currentUserCards?.length || 0}/4</span>
              </p>

              <div className="w-full h-[calc(100%-32px)] grid gap-2 overflow-hidden grid-cols-4">
                {currentUserCards?.map((card) => (
                  <div key={card.id} className="h-full flex justify-center">
                    <img
                      className="h-full object-fill"
                      src={card.image}
                      alt={"sealed card"}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PickCardsModal;
