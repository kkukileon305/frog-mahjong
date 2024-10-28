"use client";

import React, { useEffect, useRef } from "react";
import cards from "@/app/(game)/rooms/quick-game/game/cards";
import { FaPlus, FaEquals } from "react-icons/fa";
import { getCookie } from "cookies-next";
import { QUITRequest } from "@/utils/constants/frog-mahjong/socketTypes";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import useFrogMahjongStore from "@/utils/stores/frog-mahjong/useFrogMahjongStore";
import { QUIT_GAME } from "@/utils/constants/const";
import useSoundStore from "@/utils/stores/useSoundStore";

const ResultModal = () => {
  const m = useTranslations("ResultModal");

  const { winner: winnerID, clear, gameState, ws } = useFrogMahjongStore();

  const userID = getCookie("userID") as string;
  const router = useRouter();

  const winner = gameState?.users?.find((u) => u.id === winnerID);
  const losers = gameState?.users?.filter((u) => u.id !== winnerID);

  const result = useRef({
    winner,
    losers,
  });

  // sounds
  const audios = useSoundStore((s) => s.audios);

  const init = () => {
    clear();
    const quitReq: QUITRequest = {
      roomID: Number(gameState?.gameInfo?.roomID),
      event: QUIT_GAME,
      message: "",
      userID: Number(userID),
    };

    ws?.send(JSON.stringify(quitReq));
    router.push("/rooms");
  };

  useEffect(() => {
    if (winner) {
      if (winner.id === Number(userID)) {
        audios?.winAudio.play();
      } else {
        audios?.failAudio.play();
      }
    } else {
      audios?.commonDrawAudio.play();
    }
  }, []);

  return (
    <div className="p-4">
      <h3 className="text-3xl font-bold mb-8 text-center">{m("title")}</h3>
      {result.current.winner && (
        <div className="my-4">
          <div className="flex gap-4 justify-between">
            <div className="w-[120px] flex flex-col items-center gap-2">
              <p className="text-2xl font-bold">{result.current.winner.name}</p>
              <p className="font-bold text-blue-400 text-2xl">
                {result.current.winner.coin}point
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex gap-2">
                {result.current.winner.cards
                  ?.slice(0, 3)
                  ?.map((wc) => cards.find((ac) => ac.id === wc.cardID))
                  .map((card, index) => (
                    <img
                      src={card?.imageSrc!}
                      alt={card?.color! + card?.name!}
                      width={40}
                      height={58}
                      draggable={false}
                      key={card?.id!}
                    />
                  ))}
              </div>
              <FaPlus color="green" size="32" />
              <div className="flex gap-2">
                {result.current.winner.cards
                  ?.slice(3, 6)
                  ?.map((wc) => cards.find((ac) => ac.id === wc.cardID))
                  .map((card, index) => (
                    <img
                      src={card?.imageSrc!}
                      alt={card?.color! + card?.name!}
                      width={40}
                      height={58}
                      draggable={false}
                      key={card?.id!}
                    />
                  ))}
              </div>
            </div>
            <div className="w-[120px]" />
          </div>
          <div className="my-4 border-t-8 border-dotted" />
          <ul className="mb-8">
            {result.current.losers?.map((lo) => (
              <li className="flex gap-4 justify-between mb-8" key={lo.id}>
                <div className="w-[120px] flex flex-col items-center gap-2">
                  <p className="text-2xl font-bold">{lo.name}</p>
                  <p className="font-bold text-red-400 text-2xl">
                    {lo.coin}point
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex gap-2">
                    {lo.cards
                      ?.slice(0, 3)
                      ?.map((wc) => cards.find((ac) => ac.id === wc.cardID))
                      .map((card, index) => (
                        <img
                          src={card?.imageSrc!}
                          alt={card?.color! + card?.name!}
                          width={40}
                          height={58}
                          draggable={false}
                          key={card?.id!}
                        />
                      ))}
                  </div>
                  <div className="flex gap-2">
                    {lo.cards
                      ?.slice(3, 6)
                      ?.map((wc) => cards.find((ac) => ac.id === wc.cardID))
                      .map((card, index) => (
                        <img
                          src={card?.imageSrc!}
                          alt={card?.color! + card?.name!}
                          width={40}
                          height={58}
                          draggable={false}
                          key={card?.id!}
                        />
                      ))}
                  </div>
                </div>
                <div className="w-[120px]" />
              </li>
            ))}
          </ul>
        </div>
      )}

      {!result.current.winner && (
        <div className="my-4">
          <p className="bg-red-400 py-2 rounded-full mb-4 font-bold text-center text-white">
            {m("draw")}
          </p>

          <ul className="mb-8">
            {result.current.losers?.map((lo) => (
              <li className="flex gap-8 justify-center mb-8" key={lo.id}>
                <div className="w-[120px] flex flex-col items-center gap-2">
                  <p className="text-2xl font-bold">{lo.name}</p>
                  <p className="font-bold text-red-400 text-2xl">
                    {lo.coin}point
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex gap-2">
                    {lo.cards
                      ?.slice(0, 3)
                      ?.map((wc) => cards.find((ac) => ac.id === wc.cardID))
                      .map((card, index) => (
                        <img
                          src={card?.imageSrc!}
                          alt={card?.color! + card?.name!}
                          width={40}
                          height={58}
                          draggable={false}
                          key={card?.id!}
                        />
                      ))}
                  </div>
                  <div className="flex gap-2">
                    {lo.cards
                      ?.slice(3, 6)
                      ?.map((wc) => cards.find((ac) => ac.id === wc.cardID))
                      .map((card, index) => (
                        <img
                          src={card?.imageSrc!}
                          alt={card?.color! + card?.name!}
                          width={40}
                          height={58}
                          draggable={false}
                          key={card?.id!}
                        />
                      ))}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      <button
        onClick={init}
        id="back"
        className="w-full bg-sky-500 rounded-lg py-3 text-white font-bold disabled:bg-gray-400"
      >
        {m("close")}
      </button>
    </div>
  );
};

export default ResultModal;
