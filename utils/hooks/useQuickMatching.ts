import { useEffect } from "react";
import { getCookie } from "cookies-next";
import {
  ChatResponse,
  JoinPlayBody,
  JoinPlayRequest,
  MatchBodyRequest,
  MatchRequest,
  PlayTogetherBody,
  PlayTogetherRequest,
  SocketResponseBody,
} from "@/utils/constants/socketTypes";
import {
  CHAT,
  ERR_ABNORMAL_EXIT,
  FAILED_LOAN,
  GAME_OVER,
  IMPORT_SINGLE_CARD,
  JOIN_PLAY,
  LOAN,
  MATCH,
  PLAY_TOGETHER,
  REQUEST_WIN,
  ROOM_OUT,
  START,
  SUCCESS_LOAN,
} from "@/utils/constants/const";
import { useRouter } from "next/navigation";
import useGameStore from "@/utils/stores/useGameStore";
import useMatchSettingStore from "@/utils/stores/useMatchSettingStore";
import getWsUrl from "@/utils/functions/getWsUrl";
import useSoundStore from "@/utils/hooks/useSoundStore";

export type MatchingMode = "NORMAL" | "CREATE" | "ENTER";

const useQuickMatching = (mode: MatchingMode) => {
  const { timer, count, password } = useMatchSettingStore((s) => ({
    timer: s.timer,
    count: s.count,
    password: s.password,
  }));

  const router = useRouter();

  // user token info
  const accessToken = getCookie("accessToken") as string;
  const userID = getCookie("userID") as string;

  const store = useGameStore();

  // sounds
  const audios = useSoundStore((s) => s.audios);

  const connectQuickMatchingSocket = () => {
    store.setIsMatching(true);

    const url = getWsUrl({
      mode,
      password,
      timer,
      count,
      accessToken,
    });

    const newWs = new WebSocket(url);
    store.setWs(newWs);
  };

  useEffect(() => {
    if (store.ws === null) return;

    store.ws.addEventListener("open", () => {
      if (mode === "NORMAL") {
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
      } else if (mode === "CREATE") {
        const body: PlayTogetherBody = {
          timer,
          count,
        };

        const req: PlayTogetherRequest = {
          event: PLAY_TOGETHER,
          userID: Number(userID),
          message: JSON.stringify(body),
        };

        store.ws?.send(JSON.stringify(req));
      } else if (mode === "ENTER") {
        if (!password) throw new Error("비번없음");

        const body: JoinPlayBody = {
          password,
        };

        const req: JoinPlayRequest = {
          event: JOIN_PLAY,
          userID: Number(userID),
          message: JSON.stringify(body),
        };

        store.ws?.send(JSON.stringify(req));
      }
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

      if (
        eventName === MATCH ||
        eventName === PLAY_TOGETHER ||
        eventName === JOIN_PLAY
      ) {
        if (data.gameInfo?.isFull) {
          router.push("/rooms/quick-game");
          store.setIsMatching(false);
          store.setIsMatchingCompleted(true);
        }
      } else if (eventName === LOAN) {
        audios?.commonLoanAudio.play();
      } else if (eventName === FAILED_LOAN) {
        store.setIsLoanFailed(data.gameInfo?.failedLoanUserID || 0);
        audios?.commonLoanFailedAudio.play();
      } else if (eventName === START) {
        if (data.errorInfo === null) {
          store.setIsStarted(true);
          audios?.commonStartAudio.play();

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
