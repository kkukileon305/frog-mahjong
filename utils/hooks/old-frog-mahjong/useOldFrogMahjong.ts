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
} from "@/utils/constants/old-frog-mahjong/socketTypes";
import {
  CHAT,
  DISCARD,
  ERR_ABNORMAL_EXIT,
  ERR_GAME_TERMINATED,
  ERR_NOT_FOUND_CARD,
  FAILED_LOAN,
  GAME_OVER,
  IMPORT_CARDS,
  IMPORT_SINGLE_CARD,
  JOIN_PLAY,
  LOAN,
  MATCH,
  PLAY_TOGETHER,
  REQUEST_WIN,
  ROOM_OUT,
  START,
  SUCCESS_LOAN,
  TIME_OUT_DISCARD,
} from "@/utils/constants/const";
import { useRouter } from "next/navigation";
import useOldFrogMahjongStore from "@/utils/stores/old-frog-mahjong/useOldFrogMahjongStore";
import useMatchSettingStore from "@/utils/stores/useMatchSettingStore";
import getWsUrl from "@/utils/functions/getWsUrl";
import useSoundStore from "@/utils/stores/useSoundStore";
import { decryptAES, encryptAES } from "@/utils/functions/aes";
import useWingspanStore from "@/utils/stores/wingspan/useWingspanStore";

export type MatchingMode = "NORMAL" | "CREATE" | "ENTER";

const useOldFrogMahjong = (mode: MatchingMode) => {
  const { timer, count, password } = useMatchSettingStore((s) => ({
    timer: s.timer,
    count: s.count,
    password: s.password,
  }));

  const router = useRouter();

  // user token info
  const accessToken = getCookie("accessToken") as string;
  const userID = getCookie("userID") as string;

  const store = useOldFrogMahjongStore();

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
      gameType: "FROG_MAHJONG_OLD",
    });

    const newWs = new WebSocket(url);
    store.setWs(newWs);
  };

  useEffect(() => {
    if (store.ws === null) return;

    store.ws.addEventListener("open", async () => {
      if (mode === "NORMAL") {
        const body: MatchBodyRequest = {
          count,
          timer,
        };

        const encryptedMessage = await encryptAES(
          JSON.stringify(body),
          btoa(process.env.NEXT_PUBLIC_AES_KEY as string)
        );

        const req: MatchRequest = {
          event: MATCH,
          userID: Number(userID),
          message: encryptedMessage,
        };

        store.ws?.send(JSON.stringify(req));
      } else if (mode === "CREATE") {
        const body: PlayTogetherBody = {
          timer,
          count,
        };

        const encryptedMessage = await encryptAES(
          JSON.stringify(body),
          btoa(process.env.NEXT_PUBLIC_AES_KEY as string)
        );

        const req: PlayTogetherRequest = {
          event: PLAY_TOGETHER,
          userID: Number(userID),
          message: encryptedMessage,
        };

        store.ws?.send(JSON.stringify(req));
      } else if (mode === "ENTER") {
        if (!password) throw new Error("비번없음");

        const body: JoinPlayBody = {
          password,
        };

        const encryptedMessage = await encryptAES(
          JSON.stringify(body),
          btoa(process.env.NEXT_PUBLIC_AES_KEY as string)
        );

        const req: JoinPlayRequest = {
          event: JOIN_PLAY,
          userID: Number(userID),
          message: encryptedMessage,
        };

        store.ws?.send(JSON.stringify(req));
      }
    });

    store.ws.addEventListener("message", async (event) => {
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

      const decryptedMessage = await decryptAES(
        parsedBody.message,
        btoa(process.env.NEXT_PUBLIC_AES_KEY as string)
      );

      const data = JSON.parse(decryptedMessage) as SocketResponseBody;

      if (data.errorInfo?.type === ERR_GAME_TERMINATED) {
        // 연결 끊김
        const intervalId = useWingspanStore.getState().timerId;

        intervalId && clearTimeout(intervalId);

        // disconnected user store에 설정
        const disconnectedUser =
          data.users?.filter((u) => u.playerState === "disconnected") || [];
        store.setDisconnectedUsers(disconnectedUser);

        return;
      }

      store.setGameState(data);

      if (data.errorInfo?.type === ERR_ABNORMAL_EXIT) {
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
        eventName === IMPORT_CARDS ||
        eventName === DISCARD ||
        eventName === TIME_OUT_DISCARD
      ) {
        if (
          data.users?.find((u) => u.id === Number(userID))?.turnNumber ===
          data.gameInfo?.playTurn
        ) {
          audios?.myTurnAudio.play();
        }
      }

      if (
        eventName === MATCH ||
        eventName === PLAY_TOGETHER ||
        eventName === JOIN_PLAY
      ) {
        const disconnectedUser =
          data.users?.filter((u) => u.playerState === "disconnected") || [];
        store.setDisconnectedUsers(disconnectedUser);

        if (data.gameInfo?.isFull) {
          router.push("/rooms/quick-game");
          store.setIsMatching(false);
          store.setIsMatchingCompleted(true);
        }

        localStorage.setItem("sessionID", parsedBody.sessionID);
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

export default useOldFrogMahjong;
