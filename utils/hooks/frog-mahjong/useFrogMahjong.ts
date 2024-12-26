import { MatchingMode } from "@/utils/hooks/old-frog-mahjong/useOldFrogMahjong";
import useMatchSettingStore from "@/utils/stores/useMatchSettingStore";
import { useRouter } from "next/navigation";
import { getCookie } from "cookies-next";
import useFrogMahjongStore from "@/utils/stores/frog-mahjong/useFrogMahjongStore";
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
} from "@/utils/constants/frog-mahjong/socketTypes";
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

const useFrogMahjong = (mode: MatchingMode) => {
  const { timer, count, password } = useMatchSettingStore((s) => ({
    timer: s.timer,
    count: s.count,
    password: s.password,
  }));

  const router = useRouter();

  // user token info
  const accessToken = getCookie("accessToken") as string;
  const userID = getCookie("userID") as string;

  const store = useFrogMahjongStore();

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
      gameType: "FROG_MAHJONG",
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

      const data = JSON.parse(parsedBody.message) as SocketResponseBody;

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
        const intervalId = useFrogMahjongStore.getState().timerId;

        intervalId && clearTimeout(intervalId);

        return;
      }

      store.setGameState(data);

      if (data.errorInfo?.type === ERR_ABNORMAL_EXIT) {
        // TODO: 30초이상 재접속 없을시
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

        const requestedCard = useFrogMahjongStore.getState().pickable.card;

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
            useFrogMahjongStore.getState().gameState?.gameInfo?.timer;

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
          const isAllPicked =
            allUserCardIds.length + allUserDiscardedIds.length ===
            useFrogMahjongStore.getState().cards.length;

          if (isAllPicked) {
            const req: GameOverRequest = {
              event: "GAME_OVER",
              userID: Number(userID),
              message: "",
              roomID: Number(data.gameInfo.roomID),
            };

            store.ws?.send(JSON.stringify(req));
          } else {
            store.setIsHelpModalOpen(false);
            store.setIsUseItem(false);
            localStorage.removeItem("item");
            store.setIsPickCardsModal(true);
            localStorage.setItem("pick", "true");
            store.setIsTimeOut(false);
            const fullTime =
              useFrogMahjongStore.getState().gameState?.gameInfo?.timer;

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
        const cleared = localStorage.getItem("clearMissions");
        const isUseItem = localStorage.getItem("item") === "true";

        store.setIsUseItem(isUseItem);

        if (cleared) {
          const clearedMissionIDs = JSON.parse(cleared) as number[];
          store.setClearMissionIDs(clearedMissionIDs);
        }

        const fullTime =
          useFrogMahjongStore.getState().gameState?.gameInfo?.timer;

        const cm = store.allMissions.filter((m) =>
          data.gameInfo?.missionIDs.includes(m.id)
        );
        store.setCurrentMissions(cm);

        const victoryFailed = localStorage.getItem("victoryFailed") === "true";
        store.setIsVictoryFailed(victoryFailed);

        if (fullTime) {
          store.setTimer(fullTime);
        }

        const isPickedBefore = localStorage.getItem("pick") === "true";

        store.setIsPickCardsModal(isPickedBefore);

        if (useFrogMahjongStore.getState().isStarted) {
          const intervalId = setInterval(() => {
            const newTime = useFrogMahjongStore.getState().timer - 1;

            store.setTimer(newTime);
          }, 1000);

          store.setTimerId(intervalId);
        }

        const sessionID = useFrogMahjongStore.getState().sessionID;

        if (!sessionID) {
          store.setSessionID(parsedBody.sessionID);
        }

        if (data.gameInfo?.isFull) {
          router.push("/rooms/frog-mahjong");
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
            useFrogMahjongStore.getState().gameState?.gameInfo?.timer;

          if (fullTime) {
            store.setTimer(fullTime);
          }

          store.setIsStarted(true);
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

export default useFrogMahjong;
