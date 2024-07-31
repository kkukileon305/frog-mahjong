import { useEffect, useRef, useState } from "react";
import { getCookie } from "cookies-next";
import { CLOSE, JOIN } from "@/utils/const";
import {
  CLOSERequest,
  JOINResponseBody,
  UserSocket,
} from "@/utils/socketTypes";

const useWebsocket = (roomId: string) => {
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [users, setUsers] = useState<UserSocket[]>([]);

  const accessToken = getCookie("accessToken") as string;
  const userID = getCookie("userID") as string;

  useEffect(() => {
    const newWs = new WebSocket(
      `wss://dev-frog-api.jokertrickster.com/v0.1/rooms/join/ws?tkn=${accessToken}&roomID=${roomId}`
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
        console.log("open");
      });

      ws.addEventListener("message", (event) => {
        const body = event.data;
        const eventName = JSON.parse(body).event;

        if (eventName === JOIN) {
          const data = JSON.parse(JSON.parse(body).message) as JOINResponseBody;

          setUsers(data.users);
        } else if (eventName === CLOSE) {
          const data = JSON.parse(JSON.parse(body).message) as JOINResponseBody;

          setUsers(data.users);
        }
      });

      ws.addEventListener("close", (event) => {
        if (event.wasClean) {
          // 정상 종료
        } else {
          // 비정상 종료
          const newWs = new WebSocket(
            `wss://dev-frog-api.jokertrickster.com/v0.1/rooms/join/ws?tkn=${accessToken}&roomID=${roomId}`
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
  };
};

export default useWebsocket;
