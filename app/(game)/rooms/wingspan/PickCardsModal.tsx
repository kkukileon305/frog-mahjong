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
} from "@/utils/constants/wingspan/socketTypes";
import { getCookie } from "cookies-next";
import getRandomElements from "@/utils/functions/getRandomElements";
import { BirdCard } from "@/utils/axios";
import { useEffect } from "react";
import { RANDOM } from "@/utils/constants/const";
import { getSuccessCardIds } from "@/utils/functions/wingspan/checkMissions";
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
      <div className="max-w-[380px] w-full mx-auto h-full py-2 px-4 bg-white/50 rounded-[3px] overflow-hidden">
        <p className="font-extrabold text-center text-[15px] mb-2">
          {m("preview")}
        </p>

        <div className="w-full h-[calc(100%-32px)] flex gap-2 overflow-hidden justify-center">
          <div className="w-[calc(100%-48px)] flex gap-[14.8px]">
            {openCards?.map((card) => (
              <div
                key={card.id}
                className="w-full h-full relative flex justify-center items-center"
              >
                <img
                  className="max-h-[115px] h-full aspect-[130/214] object-fill"
                  src={card.image}
                  alt={"sealed card"}
                />
              </div>
            ))}
          </div>
          <div
            className={`w-20 relative flex justify-center items-center ${
              gameStore.timer > 5 && "grayscale"
            }`}
          >
            <img
              src={Timer.src}
              alt="timer"
              className="w-20"
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
    <div className="absolute w-full h-full top-0 left-0 flex justify-center items-center bg-game z-30">
      <div className="w-full h-full p-0">
        <div
          className="w-full mx-auto h-full flex flex-col rounded-xl overflow-hidden"
          style={{
            padding: inGame ? "4px" : "8px",
          }}
        >
          <div className="max-w-[380px] w-full mx-auto bg-white/50 rounded-[3px] p-1 border-[#796858] border-[1.5px] mb-2">
            <div className="">
              <p className="basis-1/6 h-[16px] text-[12px] flex items-center justify-center bg-[#FA4E38] rounded-[3px] font-bold text-white text-center tracking-[8px]">
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
                        <p className="text-[12px]">
                          {index + 1}. {m.title}
                        </p>

                        {m.image && (
                          <img
                            src={m.image}
                            alt=""
                            className="w-[14px] h-[14px]"
                          />
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          <div className="w-full h-[calc(100%-116px)] flex flex-col">
            <div className="max-w-[380px] w-full mx-auto h-[calc(200%/3)] border-[1.5px] border-[#796858] bg-[#E1EDE9] rounded-[3px] overflow-hidden py-2 px-4">
              <p className="mb-2 font-bold text-center text-[15px]">
                {m("selectOpen", {
                  count: nokoriCardsLength,
                })}
              </p>

              <div className="flex flex-col h-[calc(100%-32px)] gap-4 overflow-hidden">
                <div className="max-w-[335px] w-full mx-auto h-[calc(50%-8px)] gap-4 grid grid-cols-3">
                  {openCards.map((card) => (
                    <div
                      key={card.id}
                      className="w-full h-full overflow-hidden flex justify-center items-center"
                    >
                      <button
                        className={`max-h-full overflow-hidden aspect-[130/214] relative ${
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

                <div className="h-[calc(50%-8px)] flex justify-center items-center gap-6 bg-[#FDF9E0] border-[#796858] border-[1.5px] rounded p-2">
                  <button
                    onClick={pickCards}
                    className="w-[73px] h-[122px] font-extrabold text-[20px] text-[#7F674D] bg-[#EAE4C7] border-[0.8px] border-[#443627] rounded-[3px] disabled:bg-gray-200"
                    disabled={
                      nokoriCardsLength === 0 ||
                      inGame ||
                      leftCards.length === 0
                    }
                  >
                    랜덤
                  </button>
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
                      <p className="font-bold text-[16.5px] text-[#7F674D]">
                        {m("selectRandom")}
                      </p>
                      <p className="font-bold text-[16.5px] text-[#7F674D]">
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
                      className={`h-[calc(100%-60px)] aspect-square rounded-full bg-[#FA4E38] disabled:bg-gray-200 flex justify-center items-center text-white font-bold text-3xl shadow-[2px_2px_0px_2px_#b33333] disabled:shadow-[2px_2px_0px_2px_#bbbbbb]`}
                    >
                      ON
                    </button>

                    <div className="mt-2 flex flex-col items-center">
                      <p className="font-bold text-[16.5px] text-[#7F674D]">
                        {m("change")}
                      </p>
                      <p className="font-bold text-[16.5px] text-[#7F674D]">
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

            <div className="max-w-[380px] w-full mx-auto h-[calc((100%-8px)/3)] mt-2 border-[1.5px] border-[#796858] bg-[#ECC7C1] rounded-[3px] overflow-hidden p-4">
              <p className="font-extrabold text-center mb-2 text-[15px]">
                {m("myCard")}
                <span className="ml-4">{currentUserCards?.length || 0}/4</span>
              </p>

              <div className="w-full h-[calc(100%-32px)] grid gap-1 items-center overflow-hidden grid-cols-4">
                {currentUserCards?.map((card) => (
                  <div
                    key={card.id}
                    className="max-h-[164.6px] w-full flex h-full overflow-hidden justify-center aspect-[130/214]"
                  >
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
