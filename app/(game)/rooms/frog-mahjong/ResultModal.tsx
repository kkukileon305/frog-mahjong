"use client";

import React, {
  Dispatch,
  MouseEventHandler,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { getCookie } from "cookies-next";
import { QUITRequest } from "@/utils/constants/frog-mahjong/socketTypes";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import useFrogMahjongStore from "@/utils/stores/frog-mahjong/useFrogMahjongStore";
import { QUIT_GAME } from "@/utils/constants/const";
import useSoundStore from "@/utils/stores/useSoundStore";
import useBlockScroll from "@/utils/hooks/useBlockScroll";
import axiosInstance, { Result } from "@/utils/axios";
import useProfileIconStore from "@/utils/stores/useProfileIconStore";

const ResultModal = ({
  setIsOpen,
}: {
  setIsOpen: (isOpenResultModal: boolean) => void;
}) => {
  const m = useTranslations("ResultModal");

  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<Result | null>(null);

  const { clear, gameState, ws, allMissions, cards } = useFrogMahjongStore();
  const users = useRef(gameState?.users);

  const profileIcons = useProfileIconStore((s) => s.profileIcons);

  const currentMissionIDs = gameState?.gameInfo?.missionIDs!;

  const winner = gameState?.users?.find((u) => u.missionSuccessCount === 3);
  const winnerIcon = profileIcons.find(
    (icon) => icon.profileID === winner?.profileID
  );

  const userID = getCookie("userID") as string;
  const accessToken = getCookie("accessToken") as string;
  const router = useRouter();

  const onClose: MouseEventHandler<HTMLDivElement> = (e) => {
    if ((e.target as HTMLElement).closest("#back")) {
      setIsOpen && setIsOpen(false);
    }
  };

  useBlockScroll();

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

  const getResult = async () => {
    try {
      setIsLoading(true);

      const { data } = await axiosInstance.post<Result>(
        "/v2.1/game/result",
        {
          roomID: Number(gameState?.gameInfo?.roomID),
          userID: winner?.id,
        },
        {
          headers: {
            tkn: accessToken,
          },
        }
      );

      setResult(data);
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (winner) {
      getResult();
    }
  }, []);

  return (
    <div
      className="absolute left-0 top-0 w-full h-[calc(100dvh)] bg-game z-30 flex justify-center items-center p-2 font-sb"
      onClick={onClose}
    >
      <div className="p-2 bg-white w-full h-full border-[#796858] border-8 rounded flex flex-col gap-2">
        {winner && (
          <>
            {isLoading && (
              <div className="h-[calc(100%-40px)] flex justify-center items-center">
                loading...
              </div>
            )}

            {!isLoading && result && (
              <div className="h-[calc(100%-40px)]">
                <div className="flex justify-center items-center gap-4 h-16">
                  <img src={winnerIcon?.image} alt="" className="w-16 h-16" />
                  <div className="flex flex-col gap-1 font-bold text-[#FA4E38]">
                    <p>
                      {winner?.name}
                      {m("san")}
                    </p>
                    <p>{m("success")}</p>
                  </div>
                </div>

                <div className="h-[calc(100%-64px)] gap-2 pt-2 flex flex-col">
                  {result.missions.map((mission, idx) => (
                    <div
                      key={mission.missionID}
                      className="h-1/3 overflow-hidden flex flex-col gap-2"
                    >
                      <p>
                        {idx + 1}.{" "}
                        {
                          allMissions.find((al) => al.id === mission.missionID)
                            ?.title
                        }
                      </p>
                      <ul className="h-[calc(100%-30px)] flex gap-2">
                        {mission.cards
                          .map(
                            (cardID) =>
                              cards.find((card) => card.id === cardID)!
                          )
                          .map((card) => (
                            <li
                              key={card.id}
                              className="basis-1/4 max-h-full aspect-[63/111] flex items-center"
                            >
                              <img
                                src={card.image}
                                alt={card.name}
                                draggable={false}
                                className={`h-full aspect-[63/111] mx-auto`}
                              />
                            </li>
                          ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {!winner && (
          <div className="p-4 h-[calc(100%-40px)] flex flex-col">
            <p className="text-3xl text-[#FA4E38] text-center">{m("fail")}</p>

            <ul className="text-center py-4">
              {allMissions
                .filter((am) => currentMissionIDs.includes(am.id))
                .map((m, idx) => (
                  <li key={m.id}>
                    {idx + 1}. {m.title}
                  </li>
                ))}
            </ul>

            <ul className="max-w-[320px] h-full mx-auto grid grid-cols-2 grid-rows-2 p-4">
              {users.current?.map((u) => (
                <li key={u.id} className="p-2">
                  <div className="relative w-full aspect-square border-2 border-[#F19830] rounded">
                    <img
                      className="w-full aspect-square object-cover object-bottom"
                      src={
                        profileIcons.find((ic) => ic.profileID === u.profileID)
                          ?.image
                      }
                      alt={u.name}
                    />

                    <div className="w-5 h-5 flex justify-center items-center font-bold rounded-full top-0 right-0 translate-x-1/2 -translate-y-1/2 bg-[#F19830] absolute">
                      <p>{u.missionSuccessCount}</p>
                    </div>
                  </div>

                  <p className="mx-2 px-2 text-center bg-[#FCE4C0] rounded mt-1">
                    {u.name}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        )}

        <button
          onClick={init}
          id="back"
          className="w-full h-8 bg-[#FA4E38] rounded-lg py-1 text-white font-bold disabled:bg-gray-400"
        >
          {m("close")}
        </button>
      </div>
    </div>
  );
};

export default ResultModal;
