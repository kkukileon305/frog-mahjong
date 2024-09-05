import { useEffect, useRef, useState } from "react";
import { getCookie } from "cookies-next";
import {
  ERR_ABNORMAL_EXIT,
  ERR_WRONG_PASSWORD,
  GAME_OVER,
  JOIN,
  REQUEST_WIN,
  START,
  SUCCESS_LOAN,
  ROOM_OUT,
  ERR_GAME_IN_PROGRESS,
  ERR_ROOM_FULL,
  ERR_INTERNAL_SERVER,
  FAILED_LOAN,
  CHAT,
  LOAN,
} from "@/utils/const";
import {
  ChatResponse,
  JOINRequest,
  SocketResponseBody,
  UserSocket,
} from "@/utils/socketTypes";
import commonAllReadySrc from "@/public/audios/all_ready.mp3";
import commonDrawSrc from "@/public/audios/draw.mp3";
import commonLoanSrc from "@/public/audios/loan.mp3";
import commonLoanFailedSrc from "@/public/audios/loanfailed.mp3";
import commonStartSrc from "@/public/audios/start.mp3";

export type GameResult = {
  beforeUsers: UserSocket[] | null;
  afterUsers: UserSocket[] | null;
  isShowModal: boolean;
};

const useWebsocket = (roomID: string, password: string = "") => {
  // ws
  const [ws, setWs] = useState<WebSocket | null>(null);

  // errors
  const [isPasswordFailed, setIsPasswordFailed] = useState(false);
  const [isAbnormalExit, setIsAbnormalExit] = useState(false);
  const [isProgress, setIsProgress] = useState(false);
  const [isFullPlayer, setIsFullPlayer] = useState(false);
  const [isNoRoom, setIsNoRoom] = useState(false);
  const [isLoanFailed, setIsLoanFailed] = useState(0);

  // room state
  const [gameState, setGameState] = useState<SocketResponseBody | null>(null);
  const [isStarted, setIsStarted] = useState(false);
  const [result, setResult] = useState<GameResult>({
    beforeUsers: null,
    afterUsers: null,
    isShowModal: false,
  });
  const [kicked, setKicked] = useState<boolean>(false);
  const [winner, setWinner] = useState<UserSocket | null>(null);

  // chats
  const [chatList, setChatList] = useState<ChatResponse[]>([]);

  // sounds
  const commonAllReadyAudio = useRef<HTMLAudioElement>(
    new Audio(commonAllReadySrc)
  );
  const commonDrawAudio = useRef<HTMLAudioElement>(new Audio(commonDrawSrc));
  const commonLoanAudio = useRef<HTMLAudioElement>(new Audio(commonLoanSrc));
  const commonLoanFailedAudio = useRef<HTMLAudioElement>(
    new Audio(commonLoanFailedSrc)
  );
  const commonStartAudio = useRef<HTMLAudioElement>(new Audio(commonStartSrc));

  // user token info
  const accessToken = getCookie("accessToken") as string;
  const userID = getCookie("userID") as string;

  useEffect(() => {
    const newWs = new WebSocket(
      `wss://dev-frog-api.jokertrickster.com/v0.1/rooms/join/ws?tkn=${accessToken}&roomID=${roomID}`
    );
    setWs(newWs);

    return () => {
      newWs.close();
      setWs(null);
    };
  }, []);

  useEffect(() => {
    if (ws) {
      ws.addEventListener("open", () => {
        const body: JOINRequest = {
          event: JOIN,
          roomID: Number(roomID),
          message: password,
        };

        ws?.send(JSON.stringify(body));
      });

      ws.addEventListener("message", (event) => {
        const body = event.data;
        const parsedBody = JSON.parse(body);
        const eventName = parsedBody.event;

        if (eventName === CHAT) {
          const chatBody = parsedBody as ChatResponse;

          setChatList((prev) => [...prev, chatBody]);

          setTimeout(() => {
            setChatList((prev) =>
              prev.filter((chat) => chat.chatID !== chatBody.chatID)
            );
          }, 5000);
          return;
        }

        const data = JSON.parse(parsedBody.message) as SocketResponseBody;
        setGameState(data);

        if (data.gameInfo?.allReady) {
          commonAllReadyAudio.current.play();
        }

        if (data.errorInfo?.type === ERR_ABNORMAL_EXIT) {
          // 비정상 종료
          setIsAbnormalExit(true);
          return;
        }

        if (eventName !== FAILED_LOAN) {
          setIsLoanFailed(0);
        }

        if (eventName === JOIN) {
          if (data.errorInfo?.type === ERR_WRONG_PASSWORD) {
            // password 실패
            setIsPasswordFailed(true);
          } else if (data.errorInfo?.type === ERR_GAME_IN_PROGRESS) {
            setIsProgress(true);
          } else if (data.errorInfo?.type === ERR_ROOM_FULL) {
            setIsFullPlayer(true);
          } else if (data.errorInfo?.type === ERR_INTERNAL_SERVER) {
            setIsNoRoom(true);
          }
        } else if (eventName === LOAN) {
          commonLoanAudio.current.play();
        } else if (eventName === FAILED_LOAN) {
          setIsLoanFailed(data.gameInfo?.failedLoanUserID || 0);
          commonLoanFailedAudio.current.play();
        } else if (eventName === START) {
          if (data.errorInfo === null) {
            setIsStarted(true);
            commonStartAudio.current.play();

            setResult({
              beforeUsers: data.users,
              afterUsers: null,
              isShowModal: false,
            });
          }
        } else if (
          eventName === REQUEST_WIN ||
          eventName === GAME_OVER ||
          eventName === SUCCESS_LOAN
        ) {
          setIsStarted(false);

          if (eventName === GAME_OVER) {
            commonDrawAudio.current.play();
          }

          const newWinner =
            data.users?.find((us) => us?.cards?.length === 6) || null;

          setResult((prev) => ({
            beforeUsers: prev.beforeUsers,
            afterUsers: data.users,
            isShowModal: true,
          }));

          setWinner(newWinner);
        } else if (eventName === ROOM_OUT) {
          const currentUser = data.users?.find(
            (user) => user.id === Number(userID)
          );

          if (!currentUser) {
            setKicked(true);
          }
        }
      });

      ws.addEventListener("close", (event) => {
        setWs(null);
      });

      ws.addEventListener("error", (body) => {
        console.log(body, "error");
      });
    }
  }, [ws]);

  return {
    ws,
    accessToken,
    userID,
    users: gameState?.users ?? null,
    gameInfo: gameState?.gameInfo ?? null,
    result,
    setResult,
    isStarted,
    winner,
    setWinner,
    errors: {
      kicked,
      isProgress,
      isPasswordFailed,
      isAbnormalExit,
      isFullPlayer,
      isLoanFailed,
      setIsLoanFailed,
      isNoRoom,
    },
    chatList,
  };
};

export default useWebsocket;
