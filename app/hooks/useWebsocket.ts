import { useEffect, useRef, useState } from "react";
import { getCookie } from "cookies-next";
import { CLOSE, JOIN, READY, READY_CANCEL } from "@/utils/const";
import { JOINRequest, JOINResponseBody, UserSocket } from "@/utils/socketTypes";

const useWebsocket = (roomID: string, password: string = "") => {
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [users, setUsers] = useState<UserSocket[] | null>([]);
  const [isEnterFailed, setIsEnterFailed] = useState(false);

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
          event: "JOIN",
          roomID: Number(roomID),
          message: password,
        };

        ws?.send(JSON.stringify(body));
      });

      ws.addEventListener("message", (event) => {
        const body = event.data;
        const eventName = JSON.parse(body).event;

        if (eventName === JOIN) {
          const data = JSON.parse(JSON.parse(body).message) as JOINResponseBody;

          if (data.errorInfo?.code === 500) {
            setIsEnterFailed(true);

            ws.close();
          } else {
            setUsers(data.users);
          }
        } else if (eventName === CLOSE) {
          const data = JSON.parse(JSON.parse(body).message) as JOINResponseBody;

          setUsers(data.users);
        } else if (eventName === READY) {
          const data = JSON.parse(JSON.parse(body).message) as JOINResponseBody;

          setUsers(data.users);
        } else if (eventName === READY_CANCEL) {
          const data = JSON.parse(JSON.parse(body).message) as JOINResponseBody;

          setUsers(data.users);
        }
      });

      ws.addEventListener("close", (event) => {
        if (event.wasClean) {
          // 정상 종료
          setWs(null);
        } else {
          // 비정상 종료

          const newWs = new WebSocket(
            `wss://dev-frog-api.jokertrickster.com/v0.1/rooms/join/ws?tkn=${accessToken}&roomID=${roomID}`
          );

          setWs(newWs);
        }
      });

      ws.addEventListener("error", (body) => {
        console.log(body, "error");
      });
    }

    return () => {
      ws?.close();
    };
  }, [ws]);

  return {
    ws,
    accessToken,
    users,
    userID,
    isEnterFailed,
  };
};

export default useWebsocket;
