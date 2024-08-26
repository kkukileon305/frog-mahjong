"use client";

import { GameResult } from "@/app/hooks/useWebsocket";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import cards from "@/app/(game)/rooms/[roomID]/game/cards";
import Image from "next/image";
import { FaPlus, FaEquals } from "react-icons/fa";
import axiosInstance, { ScoreResult } from "@/utils/axios";
import { getCookie } from "cookies-next";
import getBonusName from "@/utils/getBonusName";

type ResultProps = {
  result: GameResult;
  setResult: Dispatch<SetStateAction<GameResult>>;
  roomID: string;
};

const ResultModal = ({ setResult, result, roomID }: ResultProps) => {
  const [bonuses, setBonuses] = useState<ScoreResult>();
  const [isLoading, setIsLoading] = useState(true);

  const winner = result.afterUsers?.find(
    (au) => au.coin > result.beforeUsers?.find((bu) => bu.id === au.id)?.coin!
  );

  const winnerBeforeCoin = result.beforeUsers?.find(
    (bu) => bu.id === winner?.id
  )?.coin;
  const winnerAddedCoin =
    winner && winnerBeforeCoin ? winner.coin - winnerBeforeCoin : 0;

  const losers = result.afterUsers?.filter((au) => winner?.id !== au.id);

  const init = () => {
    setResult({
      afterUsers: null,
      isShowModal: false,
      beforeUsers: null,
    });
  };

  const getBonus = async () => {
    if (winner?.cards?.length !== 6) return;

    setIsLoading(true);
    try {
      const { data } = await axiosInstance.post<ScoreResult>(
        "/v0.1/game/score/calculate",
        {
          cards: winner?.cards?.map((ci) => ({ cardID: ci.cardID })),
          roomID: Number(roomID),
        },
        {
          headers: {
            tkn: getCookie("accessToken"),
          },
        }
      );

      setBonuses(data);
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
    <div className="absolute flex justify-center items-center w-full h-full left-0 top-0 bg-black/50">
      <div className="bg-white max-w-3xl w-full rounded-xl p-8">
        {!isLoading ? (
          <>
            <h3 className="text-3xl font-bold mb-8 text-center">결과</h3>
            {winner && (
              <div className="my-4">
                <ul className="bg-red-400 py-2 rounded-full mb-4">
                  {bonuses?.bonuses.join("+")}
                </ul>
                <div className="flex gap-4 justify-between">
                  <div className="w-[120px] flex flex-col items-center gap-2">
                    <p className="text-2xl font-bold">{winner.name}</p>
                    <p className="font-bold text-blue-400 text-3xl">
                      승리 +{winnerAddedCoin}
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
                  <div className="w-[92px] flex items-center gap-4">
                    <FaEquals color="green" size="32" />
                    <p className="font-bold text-3xl text-green-500">
                      {bonuses?.score}점
                    </p>
                  </div>
                </div>
                <div className="my-4 border-t-8 border-dotted" />
                <ul className="mb-8">
                  {losers?.map((lo) => (
                    <li className="flex gap-4 justify-between mb-8">
                      <div className="w-[120px] flex flex-col items-center gap-2">
                        <p className="text-2xl font-bold">{lo.name}</p>
                        <p className="font-bold text-red-400 text-3xl">패배</p>
                        <p className="font-bold text-red-400 text-2xl">
                          {lo.coin}point
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex gap-2">
                          {lo.cards
                            ?.slice(0, 3)
                            ?.map((wc) =>
                              cards.find((ac) => ac.id === wc.cardID)
                            )
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
                            ?.map((wc) =>
                              cards.find((ac) => ac.id === wc.cardID)
                            )
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
                      <div className="w-[92px]" />
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {!winner && (
              <p className="font-bold text-2xl text-center my-8">무승부</p>
            )}
          </>
        ) : (
          <p className="font-bold text-2xl text-center my-8">결과 불러오는중</p>
        )}

        <button
          onClick={init}
          className="w-full bg-sky-500 rounded-lg py-3 text-white font-bold disabled:bg-gray-400"
        >
          닫기
        </button>
      </div>
    </div>
  );
};

export default ResultModal;
