import { useEffect, useRef, useState } from "react";
import { getCookie } from "cookies-next";
import {
  ChatResponse,
  JOINRequest,
  MatchBodyRequest,
  MatchRequest,
  SocketResponseBody,
  UserSocket,
} from "@/utils/constants/socketTypes";
import {
  CHAT,
  ERR_ABNORMAL_EXIT,
  ERR_GAME_IN_PROGRESS,
  ERR_INTERNAL_SERVER,
  ERR_ROOM_FULL,
  ERR_WRONG_PASSWORD,
  FAILED_LOAN,
  GAME_OVER,
  IMPORT_SINGLE_CARD,
  JOIN,
  LOAN,
  MATCH,
  REQUEST_WIN,
  ROOM_OUT,
  START,
  SUCCESS_LOAN,
} from "@/utils/constants/const";
import commonAllReadySrc from "@/public/audios/all_ready.mp3";
import commonLoanSrc from "@/public/audios/loan.mp3";
import commonLoanFailedSrc from "@/public/audios/loanfailed.mp3";
import commonStartSrc from "@/public/audios/start.mp3";
import { GameResult } from "@/utils/hooks/useOldMatching";
import { useRouter } from "next/navigation";
import useSounds from "@/utils/hooks/useSounds";
import useGameStore from "@/utils/stores/useGameStore";
import useMatchSettingStore from "@/utils/stores/useMatchSettingStore";

const useQuickMatching = () => {
  const { timer, count } = useMatchSettingStore((s) => ({
    timer: s.timer,
    count: s.count,
  }));

  const router = useRouter();

  // user token info
  const accessToken = getCookie("accessToken") as string;
  const userID = getCookie("userID") as string;

  const store = useGameStore();

  // sounds
  const { commonLoanAudio, commonStartAudio, commonLoanFailedAudio } =
    useSounds();

  const connectQuickMatchingSocket = () => {
    store.setIsMatching(true);
    const newWs = new WebSocket(
      `wss://dev-frog-api.jokertrickster.com/v0.1/rooms/match/ws?tkn=${accessToken}&timer=${timer}&count=${count}`
    );

    store.setWs(newWs);
  };

  useEffect(() => {
    if (store.ws === null) return;

    store.ws.addEventListener("open", () => {
      const body: MatchBodyRequest = {
        count,
        timer,
      };

      const req: MatchRequest = {
        event: MATCH,
        userID: Number(userID),
        message: JSON.stringify(body),
      };

      store.ws?.send(JSON.stringify(req));
    });

    store.ws.addEventListener("message", (event) => {
      const body = event.data;
      const parsedBody = JSON.parse(body);
      const eventName = parsedBody.event;

      if (eventName === CHAT) {
        const chatBody = parsedBody as ChatResponse;

        store.addChat(chatBody);

        setTimeout(() => {
          store.filterChat(chatBody);
        }, 5000);
        return;
      }

      const data = JSON.parse(parsedBody.message) as SocketResponseBody;
      store.setGameState(data);

      if (data.errorInfo?.type === ERR_ABNORMAL_EXIT) {
        // 비정상 종료
        store.setIsAbnormalExit(true);
        return;
      }

      if (eventName !== FAILED_LOAN) {
        store.setIsLoanFailed(0);
      }

      if (eventName !== IMPORT_SINGLE_CARD) {
        store.setIsGetCard(false);
      }

      if (eventName === MATCH) {
        if (data.gameInfo?.isFull) {
          router.push("/rooms/quick-game");
          store.setIsMatching(false);
          store.setIsMatchingCompleted(true);
        }
      } else if (eventName === LOAN) {
        commonLoanAudio.current.play();
      } else if (eventName === FAILED_LOAN) {
        store.setIsLoanFailed(data.gameInfo?.failedLoanUserID || 0);
        commonLoanFailedAudio.current.play();
      } else if (eventName === START) {
        if (data.errorInfo === null) {
          store.setIsStarted(true);
          commonStartAudio.current.play();

          store.setBeforeResult(data.users);
          store.setIsOpenResultModal(false);
        }
      } else if (
        eventName === REQUEST_WIN ||
        eventName === GAME_OVER ||
        eventName === SUCCESS_LOAN
      ) {
        store.setIsStarted(false);

        const newWinner =
          data.users?.find((us) => us?.cards?.length === 6) || null;

        store.setAfterResult(data.users);
        store.setIsOpenResultModal(true);

        store.setWinner(newWinner);
        store.setIsGameEnd(true);
      } else if (eventName === ROOM_OUT) {
        const currentUser = data.users?.find(
          (user) => user.id === Number(userID)
        );

        if (!currentUser) {
          store.setKicked(true);
        }
      }
    });

    store.ws.addEventListener("close", (event) => {
      store.setWs(null);
    });

    store.ws.addEventListener("error", (body) => {
      console.log(body, "error");
    });
  }, [store.ws]);

  return connectQuickMatchingSocket;
};

export default useQuickMatching;
