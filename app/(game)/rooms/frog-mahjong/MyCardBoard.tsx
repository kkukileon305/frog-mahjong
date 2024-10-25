import useFrogMahjongStore from "@/utils/stores/frog-mahjong/useFrogMahjongStore";
import { getCookie } from "cookies-next";
import React, { useEffect, useState } from "react";
import cards, { CardImage } from "@/app/(game)/rooms/quick-game/game/cards";
import useProfileIconStore from "@/utils/stores/useProfileIconStore";
import { Reorder } from "framer-motion";
import useSoundStore from "@/utils/stores/useSoundStore";
import { useTranslations } from "next-intl";
import { CiCircleRemove } from "react-icons/ci";
import {
  DiscardBody,
  DiscardRequest,
  WinRequest,
  WinRequestBody,
} from "@/utils/constants/frog-mahjong/socketTypes";
import { DISCARD } from "@/utils/constants/const";
import checkMissions from "@/utils/functions/frog-mahjong/checkMissions";
import { MdOutlineCancel } from "react-icons/md";

const MyCardBoard = () => {
  const m = useTranslations("MyCardBoard");

  const profileIcons = useProfileIconStore((s) => s.profileIcons);
  const audios = useSoundStore((s) => s.audios);

  const store = useFrogMahjongStore();
  const users = store.gameState?.users!;
  const gameInfo = store.gameState?.gameInfo!;
  const roomID = store.gameState?.gameInfo?.roomID!;
  const missionID = store.gameState?.gameInfo?.missionID!;

  const userID = getCookie("userID") as string;
  const accessToken = getCookie("accessToken") as string;

  const [discardMode, setDiscardMode] = useState<boolean>(false);

  const currentUser = users.find((user) => user.id === Number(userID))!;

  const userCardImages = currentUser.cards?.map(
    (card) =>
      cards.find((cardImage) => cardImage.id === card.cardID) as CardImage
  );

  const userIcon = profileIcons.find(
    (icon) => icon.profileID === currentUser?.profileID
  )!;

  const [items, setItems] = useState<CardImage[]>(userCardImages || []);

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

  const isOverFull = !!(currentUser?.cards && currentUser?.cards?.length >= 6);

  const discard = (ci: CardImage) => {
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

      audios?.cardChapAudio.play();
    }
  };

  const victory = () => {
    const isSuccess = checkMissions(items, missionID);

    if (isSuccess) {
      // TODO 성공 했을 경우 요청 (점수 필요한가?)
      const body: WinRequestBody = {
        cards: items.map((card) => ({ cardID: card.id })),
        playTurn: gameInfo?.playTurn as number,
        score: 1,
      };

      const request: WinRequest = {
        userID: Number(userID),
        event: "REQUEST_WIN",
        roomID: Number(roomID),
        message: JSON.stringify(body),
      };

      store.ws?.send(JSON.stringify(request));
    } else {
      store.setIsVictoryFailed(true);
      store.setVictoryFailedModal(true);

      setTimeout(() => {
        store.setVictoryFailedModal(false);
      }, 1000);
    }
  };

  return (
    <div className="basis-1/4 overflow-hidden flex justify-center p-2 border-2 border-red-400 rounded-xl bg-white/50 gap-2">
      <div className="basis-1/6 flex justify-center items-center gap-2">
        <div className="w-8 lg:w-12 aspect-square relative group cursor-pointer">
          {userIcon ? (
            <img
              className=" border-white border rounded-lg"
              src={userIcon.image}
              alt={currentUser.name}
            />
          ) : (
            <div>icon</div>
          )}
        </div>
        <div className="text-white">
          <p className="font-bold text-[12px] lg:text-xl">{currentUser.name}</p>
          <p className="font-bold text-[12px] lg:text-xl">
            {currentUser.coin} Point
          </p>
        </div>
      </div>

      {!discardMode && (
        <Reorder.Group
          className="flex justify-center gap-1 rounded flex-wrap relative"
          axis="x"
          values={items}
          onReorder={setItems}
        >
          {store.victoryFailedModal && (
            <div className="absolute z-10 w-full h-full bg-black/50 flex flex-col justify-center items-center">
              <MdOutlineCancel className="text-red-500 text-xl" />
            </div>
          )}

          {items.map((item, i) => (
            <Reorder.Item
              className={`cursor-pointer h-full ${i === 2 && "mr-2 lg:mr-4"}`}
              key={item.id}
              value={item}
              onDragEnd={onDragEnd}
            >
              <div className="relative h-full aspect-[63/111]">
                <img
                  src={item.imageSrc}
                  alt={item.color + item.name}
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
        <ul className="flex justify-center gap-1 rounded flex-wrap">
          {items.map((item, i) => (
            <li
              key={item.id}
              className={`cursor-pointer h-full ${i === 2 && "mr-2 lg:mr-4"}`}
            >
              <button
                className="relative h-full aspect-[63/111]"
                disabled={!isOverFull || store.isTurnOver}
                onClick={() => discard(item)}
              >
                <img
                  src={item.imageSrc}
                  alt={item.color + item.name}
                  draggable={false}
                  className="h-full"
                />
                <CiCircleRemove
                  color="red"
                  className="w-4 h-4 absolute right-0 top-0"
                />
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="basis-1/6 flex gap-2">
        {currentUser.cards && currentUser.cards.length >= 5 && (
          <>
            <button
              onClick={victory}
              disabled={
                discardMode || store.isTurnOver || store.isVictoryFailed
              }
              className="basis-1/2 text-[12px] lg:text-base text-white p-1 lg:p-2 rounded font-bold bg-orange-800 disabled:bg-gray-500 disabled:text-gray-400"
            >
              {m("victory")}
            </button>
            <button
              disabled={store.isTurnOver}
              onClick={() => setDiscardMode(!discardMode)}
              className="basis-1/2 text-[12px] lg:text-base text-white p-1 lg:p-2 rounded font-bold bg-orange-800 disabled:bg-gray-500 disabled:text-gray-400"
            >
              {m(discardMode ? "cancelSuteru" : "suteru")}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default MyCardBoard;
