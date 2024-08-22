"use client";

import { GameResult } from "@/app/hooks/useWebsocket";
import React, { Dispatch, SetStateAction } from "react";
import { UserSocket } from "@/utils/socketTypes";

type ResultProps = {
  result: GameResult;
  setResult: Dispatch<SetStateAction<GameResult>>;
  users: UserSocket[] | null;
};

const ResultModal = ({ setResult, result, users }: ResultProps) => {
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

  return (
    <div className="absolute flex justify-center items-center w-full h-full left-0 top-0 bg-black/50">
      <div className="bg-white max-w-3xl w-full rounded-xl p-8">
        <h3 className="text-3xl font-bold mb-8 text-center">결과</h3>

        {winner && (
          <div className="my-4">
            <p className="font-bold text-blue-400 text-2xl mb-2">승리</p>
            <div className="flex gap-4 justify-between mb-4">
              <div className="flex gap-4">
                <p className="text-2xl font-bold">{winner.name}</p>

                <p className="text-2xl font-bold text-blue-400">
                  +{winnerAddedCoin}
                </p>
              </div>
              <ul className="flex gap-2">{JSON.stringify(users)}</ul>
            </div>

            <p className="font-bold text-red-400 text-2xl mb-2">패배</p>
            <ul className="mb-8">
              {losers?.map((lo) => (
                <li key={lo.id} className="flex gap-4 justify-between">
                  <div className="flex gap-4">
                    <p className="text-2xl font-bold">{lo.name}</p>
                    <p className="font-bold text-red-400 text-2xl">
                      -
                      {result.beforeUsers?.find((bu) => bu.id === lo.id)
                        ?.coin! - lo.coin}
                    </p>
                  </div>
                  <p className="font-bold text-2xl">{lo.coin}</p>
                </li>
              ))}
            </ul>
          </div>
        )}

        {!winner && (
          <p className="font-bold text-2xl text-center my-8">무승부</p>
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
