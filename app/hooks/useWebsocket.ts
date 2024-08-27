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
} from "@/utils/const";
import {
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
  const router = useRouter();

  // util
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [isEnterFailed, setIsEnterFailed] = useState(false);
  const [isAbnormalExit, setIsAbnormalExit] = useState(false);

  // room state
  const [gameState, setGameState] = useState<SocketResponseBody | null>(null);
  const [isStarted, setIsStarted] = useState(false);
  const [result, setResult] = useState<GameResult>({
    beforeUsers: null,
    afterUsers: null,
    isShowModal: false,
  });
  const [kicked, setKicked] = useState<boolean>(false);

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
        const eventName = JSON.parse(body).event;

        const data = JSON.parse(JSON.parse(body).message) as SocketResponseBody;

        setGameState(data);

        if (data.errorInfo?.type === ERR_ABNORMAL_EXIT) {
          // 비정상 종료
          setIsAbnormalExit(true);
          return;
        }

        if (eventName === JOIN) {
          if (data.errorInfo?.type === ERR_WRONG_PASSWORD) {
            // password 실패
            setIsEnterFailed(true);
          }
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

          setResult((prev) => ({
            beforeUsers: prev.beforeUsers,
            afterUsers: data.users,
            isShowModal: true,
          }));
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
        router.push("/rooms");
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
    isEnterFailed,
    users: gameState?.users ?? null,
    gameInfo: gameState?.gameInfo ?? null,
    isStarted,
    isAbnormalExit,
    result,
    setResult,
    kicked,
  };
};

export default useWebsocket;
