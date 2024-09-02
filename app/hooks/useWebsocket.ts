import { useEffect, useRef, useState } from "react";
import { getCookie } from "cookies-next";
import {
  QUIT_GAME,
  ERR_ABNORMAL_EXIT,
  ERR_WRONG_PASSWORD,
  GAME_OVER,
  JOIN,
  LOAN,
  REQUEST_WIN,
  START,
  SUCCESS_LOAN,
  ROOM_OUT,
  CLOSE,
  ERR_GAME_IN_PROGRESS,
  ERR_ROOM_FULL,
  ERR_INTERNAL_SERVER,
  FAILED_LOAN,
  CHAT,
} from "@/utils/const";
import {
  ChatResponse,
  GameInfo,
  JOINRequest,
  SocketResponseBody,
  UserSocket,
} from "@/utils/socketTypes";
import { useRouter } from "next/navigation";

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
        } else if (eventName === FAILED_LOAN) {
          setIsLoanFailed(data.gameInfo?.failedLoanUserID || 0);
        } else if (eventName === START) {
          if (data.errorInfo === null) {
            setIsStarted(true);

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
    isPasswordFailed,
    users: gameState?.users ?? null,
    gameInfo: gameState?.gameInfo ?? null,
    isStarted,
    isAbnormalExit,
    result,
    setResult,
    kicked,
    isProgress,
    isFullPlayer,
    isNoRoom,
    winner,
    setWinner,
    isLoanFailed,
    setIsLoanFailed,
    chatList,
  };
};

export default useWebsocket;
