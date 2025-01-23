import { MatchingMode } from "@/utils/hooks/old-frog-mahjong/useOldFrogMahjong";
import useMatchSettingStore from "@/utils/stores/useMatchSettingStore";
import { useRouter } from "next/navigation";
import { getCookie } from "cookies-next";
import useWingspanStore from "@/utils/stores/wingspan/useWingspanStore";
import useSoundStore from "@/utils/stores/useSoundStore";
import getWsUrl from "@/utils/functions/getWsUrl";
import { useEffect } from "react";
import {
  ChatResponse,
  GameOverRequest,
  JoinPlayBody,
  JoinPlayRequest,
  MatchBodyRequest,
  MatchRequest,
  PlayTogetherBody,
  PlayTogetherRequest,
  SocketResponse,
  SocketResponseBody,
} from "@/utils/constants/wingspan/socketTypes";
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
  RANDOM,
  REQUEST_WIN,
  ROOM_OUT,
  START,
  SUCCESS_LOAN,
  TIME_OUT_DISCARD,
} from "@/utils/constants/const";
import { decryptAES, encryptAES } from "@/utils/functions/aes";

const useWingspan = (mode: MatchingMode) => {
  const { timer, count, password } = useMatchSettingStore((s) => ({
    timer: s.timer,
    count: s.count,
    password: s.password,
  }));

  const router = useRouter();

  // user token info
  const accessToken = getCookie("accessToken") as string;
  const userID = getCookie("userID") as string;

  const store = useWingspanStore();

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
      gameType: "WINGSPAN",
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
      const parsedBody = JSON.parse(body) as SocketResponse;
      const eventName = parsedBody.event;

      if (eventName === CHAT) {
        const chatBody = parsedBody as ChatResponse;

        store.addChat(chatBody);

        setTimeout(() => {
          store.filterChat(chatBody);
        }, 2000);
        return;
      }

      const decryptedMessage = await decryptAES(
        parsedBody.message,
        btoa(process.env.NEXT_PUBLIC_AES_KEY as string)
      );

      const data = JSON.parse(decryptedMessage) as SocketResponseBody;

      if (data.errorInfo?.type === ERR_NOT_FOUND_CARD) {
        if (process.env.NODE_ENV === "development") {
          console.log("set pickable true! with 404");
        }

        store.setPickable({
          isPickable: true,
          card: null,
        });
        return;
      }

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
        audios?.bg.pause();
        audios && (audios.bg.currentTime = 0);
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

      if (eventName === IMPORT_SINGLE_CARD || eventName === RANDOM) {
        audios?.cardSelect.play();

        const requestedCard = useWingspanStore.getState().pickable.card;

        const curUser = data.users?.find((u) => u.id === Number(userID));
        const importedCard = curUser?.cards?.find(
          (c) => c.cardID === requestedCard?.id
        );
        const importedPickedCard = curUser?.pickedCards?.find(
          (c) => c.cardID === requestedCard?.id
        );

        if (importedCard || importedPickedCard) {
          if (process.env.NODE_ENV === "development") {
            console.log("set pickable true!");
          }

          store.setPickable({
            isPickable: true,
            card: null,
          });
        }

        if (data.gameInfo?.allPicked) {
          store.setIsPickCardsModal(false);
          localStorage.setItem("pick", "false");
          store.setIsTurnOver(false);

          store.setIsVictoryFailed(false);

          const fullTime =
            useWingspanStore.getState().gameState?.gameInfo?.timer;

          if (fullTime) {
            store.setTimer(fullTime);
          }
        }
      }

      if (eventName === DISCARD) {
        audios?.cardDiscard.play();

        if (data.gameInfo?.allPicked) {
          const users = data.users;

          const allUserCardIds = users
            ?.map((user) =>
              user.cards ? user.cards.map((card) => card.cardID) : []
            )
            .flat()!;

          const allUserDiscardedIds = users
            ?.map((user) =>
              user.discardedCards
                ? user.discardedCards.map((card) => card.cardID)
                : []
            )
            .flat()!;

          // 무승부 체크
          const currentUser = users?.find((user) => user.id === Number(userID));

          const isAllPicked =
            allUserCardIds.length + allUserDiscardedIds.length ===
            useWingspanStore.getState().cards.length;

          if (process.env.NODE_ENV !== "production") {
            console.log(
              "가져간 카드 개수",
              allUserCardIds.length + allUserDiscardedIds.length
            );
            console.log(
              "전체 카드 개수",
              useWingspanStore.getState().cards.length
            );
          }

          if (isAllPicked) {
            store.setIsGameOver(true);

            if (currentUser?.isOwner) {
              const req: GameOverRequest = {
                event: "GAME_OVER",
                userID: Number(userID),
                message: "",
                roomID: Number(data.gameInfo.roomID),
              };

              store.ws?.send(JSON.stringify(req));
            }
          } else {
            store.setIsHelpModalOpen(false);
            store.setIsUseItem(false);
            localStorage.removeItem("item");
            store.setIsPickCardsModal(true);
            localStorage.setItem("pick", "true");
            store.setIsTimeOut(false);
            const fullTime =
              useWingspanStore.getState().gameState?.gameInfo?.timer;

            if (fullTime) {
              store.setTimer(fullTime);
            }
          }
        }
      }

      if (
        eventName === MATCH ||
        eventName === PLAY_TOGETHER ||
        eventName === JOIN_PLAY
      ) {
        // localStorage에서 끊기기 전 상태 불러옴
        const cleared = localStorage.getItem("clearMissions");
        if (cleared) {
          const clearedMissionIDs = JSON.parse(cleared) as number[];
          store.setClearMissionIDs(clearedMissionIDs);
        }

        const isUseItem = localStorage.getItem("item") === "true";
        store.setIsUseItem(isUseItem);

        const victoryFailed = localStorage.getItem("victoryFailed") === "true";
        store.setIsVictoryFailed(victoryFailed);

        const isPickedBefore = localStorage.getItem("pick") === "true";
        store.setIsPickCardsModal(isPickedBefore);

        // disconnected user 유저 재접속시 store에 설정
        const disconnectedUser =
          data.users?.filter((u) => u.playerState === "disconnected") || [];
        store.setDisconnectedUsers(disconnectedUser);

        // 다른 유저 재접속시 또는 본인 접속시 시간 초기화
        const fullTime = useWingspanStore.getState().gameState?.gameInfo?.timer;

        if (fullTime) {
          store.setTimer(fullTime);
        }

        // 현재 미션 설정
        const cm = store.allMissions.filter((m) =>
          data.gameInfo?.missionIDs.includes(m.id)
        );
        store.setCurrentMissions(cm);

        // 끊기지 않은 사용자일 경우 타이머를 다시 재생
        if (useWingspanStore.getState().isStarted) {
          const intervalId = setInterval(() => {
            const newTime = useWingspanStore.getState().timer - 1;

            store.setTimer(newTime);
          }, 1000);

          store.setTimerId(intervalId);
        }

        // 첫 MATCH시 세션ID 저장
        store.setSessionID(parsedBody.sessionID);
        localStorage.setItem("sessionID", parsedBody.sessionID);

        if (data.gameInfo?.isFull) {
          router.push("/rooms/wingspan");
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
          const fullTime =
            useWingspanStore.getState().gameState?.gameInfo?.timer;

          if (fullTime) {
            store.setTimer(fullTime);
          }

          store.setIsStarted(true);
          localStorage.setItem("isStarted", "true");

          audios?.commonStartAudio.play();
          audios && (audios.bg.loop = true);
          audios?.bg.play();

          store.setIsOpenResultModal(false);
          store.setIsPickCardsModal(true);
          localStorage.setItem("pick", "true");
          store.setIsRouletteLoading(false);
        }
      } else if (
        eventName === REQUEST_WIN ||
        eventName === GAME_OVER ||
        eventName === SUCCESS_LOAN
      ) {
        store.setIsStarted(false);

        store.setIsOpenResultModal(true);

        store.setWinner(data.gameInfo?.winner || 0);
        store.setIsGameEnd(true);
        audios?.bg.pause();
        audios && (audios.bg.currentTime = 0);
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

export default useWingspan;
