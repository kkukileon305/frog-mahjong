import useWingspanStore from "@/utils/stores/wingspan/useWingspanStore";
import { getCookie } from "cookies-next";
import React, { useEffect, useState } from "react";
import useProfileIconStore from "@/utils/stores/useProfileIconStore";
import { Reorder } from "framer-motion";
import useSoundStore from "@/utils/stores/useSoundStore";
import { useTranslations } from "next-intl";
import { CiCircleRemove } from "react-icons/ci";
import {
  DiscardBody,
  DiscardRequest,
  MissionBody,
  MissionRequest,
  WinRequest,
  WinRequestBody,
} from "@/utils/constants/wingspan/socketTypes";
import { DISCARD } from "@/utils/constants/const";
import getSuccessMissionIDs from "@/utils/functions/wingspan/checkMissions";
import { MdOutlineCancel } from "react-icons/md";
import { BirdCard } from "@/utils/axios";
import getRandomElements from "@/utils/functions/getRandomElements";
import { encryptAES } from "@/utils/functions/aes";

const MyCardBoard = () => {
  const m = useTranslations("MyCardBoard");

  const profileIcons = useProfileIconStore((s) => s.profileIcons);
  const audios = useSoundStore((s) => s.audios);

  const store = useWingspanStore();
  const users = store.gameState?.users!;
  const gameInfo = store.gameState?.gameInfo!;
  const roomID = store.gameState?.gameInfo?.roomID!;
  const missionIDs = store.gameState?.gameInfo?.missionIDs!;
  const cards = store.cards;

  const currentMissions = store.currentMissions;

  const userID = getCookie("userID") as string;

  const [discardMode, setDiscardMode] = useState<boolean>(false);

  const currentUser = users.find((user) => user.id === Number(userID))!;

  const userCardImages = currentUser.cards?.map(
    (card) => cards.find((cardImage) => cardImage.id === card.cardID)!
  );

  const [items, setItems] = useState<BirdCard[]>(userCardImages || []);

  useEffect(() => {
    const newItems = userCardImages?.sort((ci) => ci.id) || [];
    const oldItems = items?.sort((ci) => ci.id) || [];

    // 길이가 같다면 같은 패로 간주
    if (newItems.length !== oldItems.length) {
      if (newItems.length > oldItems.length) {
        // 추가 된 경우
        const newItem = newItems.find(
          (nic) => !oldItems.find((oic) => oic.id === nic.id)
        )!!;

        const newList = [...items, newItem];
        setItems(newList);
      } else {
        // 빠진 경우
        const removedItem = oldItems.find(
          (oic) => !newItems.find((nic) => oic.id === nic.id)
        )!!;

        setItems(items.filter((item) => item.id !== removedItem.id));
        setDiscardMode(false);
      }
    }
  }, [userCardImages]);

  const onDragEnd = async () => {
    await audios?.cardMovieAudio.play();
  };

  const isOverFull = !!(currentUser?.cards && currentUser?.cards?.length >= 4);

  const discard = async (ci: BirdCard) => {
    if (isOverFull) {
      const body: DiscardBody = {
        cardID: ci.id,
        playTurn: gameInfo?.playTurn as number,
      };

      const encryptedMessage = await encryptAES(
        JSON.stringify(body),
        btoa(process.env.NEXT_PUBLIC_AES_KEY as string)
      );

      const request: DiscardRequest = {
        userID: currentUser?.id,
        event: DISCARD,
        roomID: Number(roomID),
        message: encryptedMessage,
      };

      store.ws?.send(JSON.stringify(request));
      setDiscardMode(false);
      store.setIsTurnOver(true);
    }
  };

  const victory = async () => {
    const successMissionIDs = getSuccessMissionIDs(items, currentMissions);

    const mergedClearIds = Array.from(
      new Set([...store.clearMissionIDs, ...successMissionIDs])
    );

    if (process.env.NODE_ENV === "development") {
      console.log("성공 미션 ID:", successMissionIDs);
      console.log("이미 클리어한 ID: ", store.clearMissionIDs);
      console.log(
        "성공에서 클리어 뺸 ID:",
        successMissionIDs.filter((sd) => !store.clearMissionIDs.includes(sd))
      );
    }

    // 기존 클리어한 값 제외
    const clearMissionsWithoutBefore = successMissionIDs.filter(
      (sd) => !store.clearMissionIDs.includes(sd)
    );

    const isSuccess = clearMissionsWithoutBefore.length !== 0;

    if (isSuccess) {
      const body: MissionBody = {
        missionIDs: clearMissionsWithoutBefore,
        cards: items.map((item) => item.id),
      };

      const encryptedMessage = await encryptAES(
        JSON.stringify(body),
        btoa(process.env.NEXT_PUBLIC_AES_KEY as string)
      );

      const request: MissionRequest = {
        userID: currentUser?.id,
        event: "MISSION",
        message: encryptedMessage,
      };

      store.ws?.send(JSON.stringify(request));
      store.setIsVictoryFailed(true);
      localStorage.setItem("victoryFailed", "true");
      audios?.missionSuccess.play();
    } else {
      store.setIsVictoryFailed(true);
      localStorage.setItem("victoryFailed", "true");

      store.setVictoryFailedModal(true);

      audios?.missionFailed.play();

      setTimeout(() => {
        store.setVictoryFailedModal(false);
      }, 1000);
    }

    store.setClearMissionIDs(mergedClearIds);
    localStorage.setItem("clearMissions", JSON.stringify(mergedClearIds));
  };

  // mission clear count check
  useEffect(() => {
    (async () => {
      if (currentUser.missionSuccessCount === 3) {
        const body: WinRequestBody = {
          cards: items.map((i) => ({
            cardID: i.id,
          })),
        };

        const encryptedMessage = await encryptAES(
          JSON.stringify(body),
          btoa(process.env.NEXT_PUBLIC_AES_KEY as string)
        );

        const req: WinRequest = {
          userID: currentUser?.id,
          event: "REQUEST_WIN",
          roomID: roomID,
          message: encryptedMessage,
        };

        store.ws?.send(JSON.stringify(req));
        return;
      }
    })();
  }, [currentUser.missionSuccessCount]);

  useEffect(() => {
    (async () => {
      if (store.timer === 0 && !store.isPickCardsModal && !store.isGameEnd) {
        // 만료시 랜덤
        const randomCard = getRandomElements(items, 1)[0];

        if (isOverFull) {
          const body: DiscardBody = {
            cardID: randomCard.id,
            playTurn: gameInfo?.playTurn as number,
          };

          const encryptedMessage = await encryptAES(
            JSON.stringify(body),
            btoa(process.env.NEXT_PUBLIC_AES_KEY as string)
          );

          const request: DiscardRequest = {
            userID: currentUser?.id,
            event: DISCARD,
            roomID: Number(roomID),
            message: encryptedMessage,
          };

          store.ws?.send(JSON.stringify(request));
          setDiscardMode(false);
          store.setIsTurnOver(true);

          audios?.cardChapAudio.play();
        }
      }
    })();
  }, [store.timer]);

  return (
    <div className="h-full overflow-hidden flex justify-center flex-col p-1 bg-[#FDF9E0] rounded-[5px] gap-1 border-[1.5px] border-[#796858]">
      {!discardMode && (
        <Reorder.Group
          className="w-full h-[calc(100%-44px)] flex gap-[5.8px] rounded relative basis-4/5 justify-center py-1"
          axis="x"
          values={items}
          onReorder={setItems}
        >
          {store.victoryFailedModal && (
            <div className="absolute z-10 w-full h-full bg-black/50 flex flex-col justify-center items-center">
              <MdOutlineCancel className="text-red-500 text-xl" />
            </div>
          )}

          {items.map((item) => (
            <Reorder.Item
              className={`cursor-pointer w-[83.637px] max-h-full aspect-[130/214] flex items-center`}
              key={item.id}
              value={item}
              onDragEnd={onDragEnd}
            >
              <div className="w-full max-h-full relative aspect-[130/214] flex justify-center">
                <img
                  src={item.image}
                  alt={item.name}
                  draggable={false}
                  className={`h-full ${
                    currentUser.discardedCards?.find(
                      (dc) => dc.cardID === item.id
                    ) && "grayscale"
                  }`}
                />
              </div>
            </Reorder.Item>
          ))}
        </Reorder.Group>
      )}

      {discardMode && (
        <ul className="w-full h-[calc(100%-44px)] flex gap-[5.8px] rounded relative basis-4/5 justify-center py-1">
          {items.map((item) => (
            <li
              key={item.id}
              className={`cursor-pointer w-[83.637px] max-h-full aspect-[130/214] flex items-center`}
            >
              <button
                className="w-full max-h-full relative aspect-[130/214] flex justify-center"
                disabled={!isOverFull || store.isTurnOver}
                onClick={() => discard(item)}
              >
                <div className="relative w-full max-h-full aspect-[130/214] flex justify-center">
                  <img
                    src={item.image}
                    alt={item.name}
                    draggable={false}
                    className="h-full"
                  />
                  <CiCircleRemove
                    color="red"
                    className="w-4 h-4 absolute right-0 top-0"
                  />
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="h-8 flex gap-4 overflow-hidden">
        {currentUser.cards && (
          <>
            <div className="flex gap-1">
              {currentMissions?.map((mission, idx) => (
                <div
                  key={mission.id}
                  className={`font-bold aspect-square text-[18px] text-[#333333] flex justify-center items-center ${
                    store.clearMissionIDs.includes(mission.id)
                      ? "bg-[#FF5555]"
                      : "bg-[#C9F2A3]"
                  }`}
                >
                  {idx + 1}
                </div>
              ))}
            </div>

            <div className="flex w-[calc(100%-96px)] gap-[6.57px]">
              <button
                disabled={store.isTurnOver}
                onClick={() => setDiscardMode(!discardMode)}
                className="basis-1/2 flex items-center justify-center text-[12px] lg:text-base p-1 lg:p-2 border-[1.5px] border-white rounded-[3px] font-bold bg-[#ECC7C1] disabled:bg-gray-500 disabled:text-gray-400"
              >
                {m(discardMode ? "cancelSuteru" : "suteru")}
              </button>
              <button
                onClick={victory}
                disabled={
                  discardMode || store.isTurnOver || store.isVictoryFailed
                }
                className="basis-1/2 flex items-center justify-center text-[12px] lg:text-base p-1 lg:p-2 border-[1.5px] border-white rounded-[3px] font-bold bg-[#E1EDE9] disabled:bg-gray-500 disabled:text-gray-400"
              >
                {m("victory")}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MyCardBoard;
