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
import { QUITRequest } from "@/utils/constants/wingspan/socketTypes";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import useWingspanStore from "@/utils/stores/wingspan/useWingspanStore";
import { QUIT_GAME } from "@/utils/constants/const";
import useSoundStore from "@/utils/stores/useSoundStore";
import useBlockScroll from "@/utils/hooks/useBlockScroll";
import axiosInstance, { DrawData, Result } from "@/utils/axios";
import useProfileIconStore from "@/utils/stores/useProfileIconStore";

const ResultModal = () => {
  const m = useTranslations("ResultModal");

  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [drawData, setDrawData] = useState<DrawData | null>(null);

  const {
    clear,
    gameState,
    ws,
    allMissions,
    cards,
    timerId,
    setIsOpenResultModal,
    isGameOver,
    clearMissionIDs,
  } = useWingspanStore();
  const users = useRef(gameState?.users);

  const roomID = gameState?.gameInfo?.roomID!;

  const profileIcons = useProfileIconStore((s) => s.profileIcons);

  const currentMissionIDs = gameState?.gameInfo?.missionIDs!;
  const currentMissions = useRef(
    allMissions.filter((am) => currentMissionIDs.includes(am.id))
  );

  const winner = users.current?.find((u) => u.missionSuccessCount === 3);
  const winnerIcon = profileIcons.find(
    (icon) => icon.profileID === winner?.profileID
  );

  const userID = getCookie("userID") as string;
  const accessToken = getCookie("accessToken") as string;
  const router = useRouter();

  const onClose: MouseEventHandler<HTMLDivElement> = (e) => {
    if ((e.target as HTMLElement).closest("#back")) {
      setIsOpenResultModal(false);
    }
  };

  useBlockScroll();

  // sounds
  const audios = useSoundStore((s) => s.audios);

  const init = () => {
    clear();

    localStorage.removeItem("sessionID");
    localStorage.removeItem("matchMode");
    localStorage.removeItem("pick");
    localStorage.removeItem("clearMissions");
    localStorage.removeItem("victoryFailed");
    localStorage.removeItem("isStarted");

    timerId && clearTimeout(timerId);

    const quitReq: QUITRequest = {
      roomID: Number(gameState?.gameInfo?.roomID),
      event: QUIT_GAME,
      message: "",
      userID: Number(userID),
    };

    ws?.send(JSON.stringify(quitReq));

    setTimeout(() => {
      router.push("/rooms");
    }, 0);
  };

  useEffect(() => {
    if (!isGameOver && winner) {
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

      getResult();
    } else {
      // 무승부시 api 요청
      const getDrawResult = async () => {
        try {
          setIsLoading(true);

          const { data } = await axiosInstance.get<DrawData>(
            `/v2.1/game/${roomID}/draw`,
            {
              headers: {
                tkn: accessToken,
              },
            }
          );

          setDrawData(data);
        } catch (e) {
          console.log(e);
        } finally {
          setIsLoading(false);
        }
      };

      getDrawResult();
    }
  }, []);

  return (
    <div
      className="absolute left-0 top-0 w-full h-[calc(100dvh)] bg-game z-30 flex justify-center items-center p-2 font-extrabold"
      onClick={onClose}
    >
      <div
        style={{
          padding: isGameOver ? 4 : 16,
          paddingBottom: 16,
        }}
        className="bg-white/65 w-full h-full border-[#796858] border-2 rounded-[5px] flex flex-col gap-2"
      >
        {winner && (
          <>
            {isLoading && (
              <div className="w-full h-[calc(100%-40px)] flex justify-center items-center">
                loading...
              </div>
            )}

            {!isLoading && result && (
              <div className="w-full h-[calc(100%-40px)]">
                <div className="flex justify-center items-center gap-4 h-[70px]">
                  <img
                    src={winnerIcon?.image}
                    alt=""
                    className="w-[70px] h-[70px] border-2 border-[#F19830] object-bottom object-cover"
                  />
                  <div className="flex flex-col gap-1 font-bold text-[#FA4E38] text-[19px]">
                    <p>
                      {winner?.name}
                      {m("san")}
                    </p>
                    <p>{m("success")}</p>
                  </div>
                </div>

                <div className="h-[calc(100%-70px)] gap-2 pt-4 flex flex-col">
                  {result.missions.map((mission, idx) => (
                    <div
                      key={mission.missionID}
                      className="h-1/3 overflow-hidden flex flex-col justify-center"
                    >
                      <p className="text-[16px]">
                        {idx + 1}.{" "}
                        {
                          allMissions.find((al) => al.id === mission.missionID)
                            ?.title
                        }
                      </p>
                      <ul className="h-[calc(100%-24px)] flex gap-[5.8352px] justify-center items-center">
                        {mission.cards
                          .map(
                            (cardID) =>
                              cards.find((card) => card.id === cardID)!
                          )
                          .map((card) => (
                            <li
                              key={card.id}
                              className="h-full max-h-[137.6794px] aspect-[130/214] flex items-center"
                            >
                              <img
                                src={card.image}
                                alt={card.name}
                                draggable={false}
                                className={`h-full aspect-[130/214] mx-auto`}
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
          <>
            {isLoading && (
              <div className="w-full h-[calc(100%-40px)] flex justify-center items-center">
                loading...
              </div>
            )}

            {!isLoading && drawData && (
              <div className="w-full h-[calc(100%-40px)] flex flex-col">
                {/*Panel*/}
                <div className="max-w-[380px] w-full mx-auto bg-white/50 rounded-[3px] p-1 border-[#796858] border-[1.5px]">
                  <div className="">
                    <p className="basis-1/6 h-[16px] text-[12px] flex items-center justify-center bg-[#FA4E38] rounded-[3px] font-bold text-white text-center tracking-[8px]">
                      {m("mission")}
                    </p>

                    <div className="py-2 px-4">
                      {currentMissions.current &&
                        currentMissions.current.map((m, index) => (
                          <div
                            key={m.id}
                            className={`flex justify-between basis-5/6 font-bold text-xs text-black ${
                              clearMissionIDs.includes(m.id) && "line-through"
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
                {/*Panel end*/}

                <p className="text-3xl text-[#FA4E38] text-center py-4">
                  {m("fail")}
                </p>

                <ul className="w-full h-[calc(100%-90px-68px)] mx-auto flex flex-col px-2">
                  {users.current?.map((u) => (
                    <li key={u.id} className="h-1/4 p-2 flex gap-2">
                      <div className="w-[90px] h-full flex flex-col gap-1">
                        <img
                          className="w-[90px] aspect-square overflow-hidden object-cover bg-white object-bottom"
                          src={
                            profileIcons.find(
                              (ic) => ic.profileID === u.profileID
                            )?.image
                          }
                          alt={u.name}
                        />

                        <p className="h-[calc(100%-98px)] flex justify-center items-center mx-2 px-2 text-[7px] text-center bg-white rounded">
                          {u.name}
                        </p>
                      </div>

                      <div className="w-[calc(100%-98px)] h-[90px] bg-white p-8 flex flex-col justify-center gap-2">
                        {currentMissions.current &&
                          currentMissions.current.map((m, index) => (
                            <div
                              key={m.id}
                              className={`flex justify-between font-bold text-xs text-black ${
                                drawData.users
                                  .find((tu) => tu.userID === u.id)
                                  ?.successMissions.includes(m.id) &&
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
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}

        <button
          onClick={init}
          id="back"
          className="w-full max-w-[118px] mx-auto bg-[#FA4E38] rounded-full py-1 text-white font-bold disabled:bg-gray-400"
        >
          {m("close")}
        </button>
      </div>
    </div>
  );
};

export default ResultModal;
