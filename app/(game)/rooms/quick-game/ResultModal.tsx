"use client";

import React, { useEffect, useRef, useState } from "react";
import cards from "@/app/(game)/rooms/quick-game/game/cards";
import Image from "next/image";
import { FaPlus, FaEquals } from "react-icons/fa";
import axiosInstance, { ScoreEndResult } from "@/utils/axios";
import { getCookie } from "cookies-next";
import mergeBonus from "@/utils/functions/mergeBonus";
import { QUITRequest } from "@/utils/constants/socketTypes";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import useGameStore from "@/utils/stores/useGameStore";
import { QUIT_GAME } from "@/utils/constants/const";
import useSoundStore from "@/utils/hooks/useSoundStore";

const ResultModal = () => {
  const m = useTranslations("ResultModal");

  const { result, winner, clear, gameState, ws, setIsGameEnd } = useGameStore();

  const userID = getCookie("userID") as string;
  const router = useRouter();

  // sounds
  const audios = useSoundStore((s) => s.audios);

  const [bonuses, setBonuses] = useState<ScoreEndResult>();
  const [isLoading, setIsLoading] = useState(true);

  const winnerBeforeCoin = result.beforeUsers?.find(
    (bu) => bu.id === winner?.id
  )?.coin;
  const winnerAddedCoin =
    winner && winnerBeforeCoin ? winner.coin - winnerBeforeCoin : 0;

  const losers = result.afterUsers?.filter((au) => winner?.id !== au.id);

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

  const getBonus = async () => {
    setIsLoading(true);
    try {
      const { data } = await axiosInstance.post<ScoreEndResult>(
        "/v0.1/game/result",
        {
          cards: winner?.cards?.map((ci) => ({ cardID: ci.cardID })),
          roomID: Number(gameState?.gameInfo?.roomID),
        },
        {
          headers: {
            tkn: getCookie("accessToken"),
          },
        }
      );

      setBonuses(data);

      if (winner) {
        console.log(audios);
        if (winner.id === Number(userID)) {
          audios?.winAudio.play();
        } else {
          audios?.failAudio.play();
        }
      } else {
        audios?.commonDrawAudio.play();
      }
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getBonus();
  }, []);

  return (
    <div className="p-4">
      {!isLoading ? (
        <>
          <h3 className="text-3xl font-bold mb-8 text-center">{m("title")}</h3>
          {winner && (
            <div className="my-4">
              <p className="bg-red-400 py-2 rounded-full mb-4 font-bold text-center text-white">
                {bonuses &&
                  mergeBonus(bonuses.bonuses.map((b) => m(b))!).join(" + ")}
              </p>
              <div className="flex gap-4 justify-between">
                <div className="w-[120px] flex flex-col items-center gap-2">
                  <p className="text-2xl font-bold">{winner.name}</p>
                  <p className="font-bold text-blue-400 text-2xl">
                    {m("win")} +{winnerAddedCoin}
                  </p>
                  <p className="font-bold text-blue-400 text-2xl">
                    {winner.coin}point
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex gap-2">
                    {winner.cards
                      ?.slice(0, 3)
                      ?.map((wc) => cards.find((ac) => ac.id === wc.cardID))
                      .map((card, index) => (
                        <Image
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
                    {winner.cards
                      ?.slice(3, 6)
                      ?.map((wc) => cards.find((ac) => ac.id === wc.cardID))
                      .map((card, index) => (
                        <Image
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
                <div className="w-[120px] flex items-center gap-4">
                  <FaEquals color="green" size="32" />
                  <p className="font-bold text-3xl text-green-500">
                    {bonuses?.score}
                    {m("score")}
                  </p>
                </div>
              </div>
              <div className="my-4 border-t-8 border-dotted" />
              <ul className="mb-8">
                {losers?.map((lo) => (
                  <li className="flex gap-4 justify-between mb-8" key={lo.id}>
                    <div className="w-[120px] flex flex-col items-center gap-2">
                      <p className="text-2xl font-bold">{lo.name}</p>
                      <p className="font-bold text-red-400 text-2xl text-center">
                        {m("lose")} -
                        {result.beforeUsers?.find((bu) => bu.id === lo.id)!
                          .coin! - lo.coin}
                      </p>
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
                            <Image
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
                            <Image
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

          {!winner && (
            <div className="my-4">
              <p className="bg-red-400 py-2 rounded-full mb-4 font-bold text-center text-white">
                {m("draw")}
              </p>

              <ul className="mb-8">
                {losers?.map((lo) => (
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
                            <Image
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
                            <Image
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
        </>
      ) : (
        <p className="font-bold text-2xl text-center my-8">{m("loading")}</p>
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
