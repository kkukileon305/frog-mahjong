import { useEffect, useRef, useState } from "react";
import { getCookie } from "cookies-next";
import { JOIN } from "@/utils/const";
import { JOINResponseBody, User } from "@/utils/socketTypes";

const useWebsocket = (roomId: string) => {
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [users, setUsers] = useState<User[]>([]);

  const accessToken = getCookie("accessToken") as string;
  const userID = getCookie("userID") as string;

  useEffect(() => {
    const newWs = new WebSocket(
      `ws://dev-frog-api.jokertrickster.com/v0.1/rooms/join/ws?tkn=${accessToken}&roomID=${roomId}`
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

        switch (eventName) {
          case JOIN:
            const data = JSON.parse(
              JSON.parse(body).message
            ) as JOINResponseBody;

            setUsers(data.users);
            break;
          default:
        }
      });

      ws.addEventListener("close", (event) => {
        if (event.wasClean) {
          console.log("정상종료");
        } else {
          console.log("비정상 종료.", event);
          const newWs = new WebSocket(
            `ws://dev-frog-api.jokertrickster.com/v0.1/rooms/join/ws?tkn=${accessToken}&roomID=${roomId}`
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
