import useFrogMahjongStore from "@/utils/stores/frog-mahjong/useFrogMahjongStore";
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
} from "@/utils/constants/frog-mahjong/socketTypes";
import { DISCARD } from "@/utils/constants/const";
import getSuccessMissionIDs from "@/utils/functions/frog-mahjong/checkMissions";
import { MdOutlineCancel } from "react-icons/md";
import { BirdCard } from "@/utils/axios";
import { request } from "node:http";
import getRandomElements from "@/utils/functions/getRandomElements";

const MyCardBoard = () => {
  const m = useTranslations("MyCardBoard");

  const profileIcons = useProfileIconStore((s) => s.profileIcons);
  const audios = useSoundStore((s) => s.audios);

  const store = useFrogMahjongStore();
  const users = store.gameState?.users!;
  const gameInfo = store.gameState?.gameInfo!;
  const roomID = store.gameState?.gameInfo?.roomID!;
  const missionIDs = store.gameState?.gameInfo?.missionIDs!;
  const cards = store.cards;

  const currentMissions = store.allMissions.filter((m) =>
    missionIDs?.includes(m.id)
  );

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

  const discard = (ci: BirdCard) => {
    if (isOverFull) {
      const body: DiscardBody = {
        cardID: ci.id,
        playTurn: gameInfo?.playTurn as number,
      };

      const request: DiscardRequest = {
        userID: currentUser?.id,
        event: DISCARD,
        roomID: Number(roomID),
        message: JSON.stringify(body),
      };

      store.ws?.send(JSON.stringify(request));
      setDiscardMode(false);
      store.setIsTurnOver(true);
    }
  };

  const victory = () => {
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

      const request: MissionRequest = {
        userID: currentUser?.id,
        event: "MISSION",
        message: JSON.stringify(body),
      };

      store.ws?.send(JSON.stringify(request));
      store.setIsVictoryFailed(true);
      audios?.missionSuccess.play();
    } else {
      store.setIsVictoryFailed(true);
      store.setVictoryFailedModal(true);

      audios?.missionFailed.play();

      setTimeout(() => {
        store.setVictoryFailedModal(false);
      }, 1000);
    }

    store.setClearMissionIDs(mergedClearIds);
  };

  // mission clear count check
  useEffect(() => {
    if (currentUser.missionSuccessCount === 3) {
      const body: WinRequestBody = {
        cards: items.map((i) => ({
          cardID: i.id,
        })),
      };

      const req: WinRequest = {
        userID: currentUser?.id,
        event: "REQUEST_WIN",
        roomID: roomID,
        message: JSON.stringify(body),
      };

      store.ws?.send(JSON.stringify(req));
      return;
    }
  }, [currentUser.missionSuccessCount]);

  useEffect(() => {
    if (store.timer === 0 && !store.isPickCardsModal && !store.isGameEnd) {
      // 만료시 랜덤
      const randomCard = getRandomElements(items, 1)[0];

      if (isOverFull) {
        const body: DiscardBody = {
          cardID: randomCard.id,
          playTurn: gameInfo?.playTurn as number,
        };

        const request: DiscardRequest = {
          userID: currentUser?.id,
          event: DISCARD,
          roomID: Number(roomID),
          message: JSON.stringify(body),
        };

        store.ws?.send(JSON.stringify(request));
        setDiscardMode(false);
        store.setIsTurnOver(true);

        audios?.cardChapAudio.play();
      }
    }
  }, [store.timer]);

  return (
    <div className="h-full overflow-hidden flex justify-center flex-col p-4 bg-[#FDF9E0] rounded-xl gap-1 border-4 border-white">
      {!discardMode && (
        <Reorder.Group
          className="w-full h-[calc(100%-44px)] flex gap-1 rounded relative basis-4/5 justify-center py-1"
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
              className={`cursor-pointer basis-1/4 max-h-full aspect-[63/111] flex items-center`}
              key={item.id}
              value={item}
              onDragEnd={onDragEnd}
            >
              <div className="w-full max-h-full relative aspect-[63/111] flex justify-center">
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
        <ul className="w-full h-[calc(100%-44px)] flex gap-1 rounded relative basis-4/5 justify-center py-1">
          {items.map((item) => (
            <li
              key={item.id}
              className={`cursor-pointer basis-1/4 max-h-full aspect-[63/111] flex items-center`}
            >
              <button
                className="w-full max-h-full relative aspect-[63/111] flex justify-center"
                disabled={!isOverFull || store.isTurnOver}
                onClick={() => discard(item)}
              >
                <div className="relative w-full max-h-full aspect-[63/111] flex justify-center">
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

      <div className="h-8 flex gap-4 py-1 overflow-hidden">
        {currentUser.cards && (
          <>
            <div className="flex gap-1">
              {currentMissions?.map((mission, idx) => (
                <div
                  key={mission.id}
                  className={`font-bold aspect-square flex justify-center items-center ${
                    store.clearMissionIDs.includes(mission.id)
                      ? "bg-red-400"
                      : "bg-[#C8F3A3]"
                  }`}
                >
                  {idx + 1}
                </div>
              ))}
            </div>

            <div className="flex w-[calc(100%-96px)] gap-4">
              <button
                onClick={victory}
                disabled={
                  discardMode || store.isTurnOver || store.isVictoryFailed
                }
                className="basis-1/2 flex items-center justify-center text-[10px] lg:text-base p-1 lg:p-2 rounded font-bold bg-[#C6D4FF] disabled:bg-gray-500 disabled:text-gray-400"
              >
                {m("victory")}
              </button>
              <button
                disabled={store.isTurnOver}
                onClick={() => setDiscardMode(!discardMode)}
                className="basis-1/2 flex items-center justify-center text-[10px] lg:text-base p-1 lg:p-2 rounded font-bold bg-[#C8F3A3] disabled:bg-gray-500 disabled:text-gray-400"
              >
                {m(discardMode ? "cancelSuteru" : "suteru")}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MyCardBoard;
