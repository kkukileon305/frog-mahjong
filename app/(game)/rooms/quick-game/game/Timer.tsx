"use client";

import {
  DiscardBody,
  DiscardRequest,
  DORABody,
  DORARequest,
  GameOverRequest,
  ImportCardBody,
  ImportRequest,
  LoanFailedBody,
  LoanFailedRequest,
  TimeoutDiscardRequest,
} from "@/utils/constants/socketTypes";
import { CardImage } from "@/app/(game)/rooms/quick-game/game/cards";
import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { getCookie } from "cookies-next";
import { useParams } from "next/navigation";
import getRandomElements from "@/utils/functions/getRandomElements";
import {
  DISCARD,
  DORA,
  FAILED_LOAN,
  GAME_OVER,
  IMPORT_CARDS,
  TIME_OUT_DISCARD,
} from "@/utils/constants/const";
import useGameStore from "@/utils/stores/useGameStore";
import useSoundStore from "@/utils/hooks/useSoundStore";

type TimerProps = {
  leftCards: CardImage[];
  setSelectedCards: Dispatch<SetStateAction<CardImage[]>>;
};

const Timer = ({ leftCards, setSelectedCards }: TimerProps) => {
  const { roomID } = useParams<{ roomID: string }>();

  const { ws, gameInfo, users } = useGameStore((s) => ({
    gameInfo: s.gameState?.gameInfo,
    users: s.gameState?.users,
    ws: s.ws,
  }));

  const audios = useSoundStore((s) => s.audios);
  const [time, setTime] = useState(gameInfo?.timer);

  const userID = getCookie("userID") as string;
  const currentUser = users?.find((user) => user.id === Number(userID));

  const isActive =
    gameInfo?.playTurn === currentUser?.turnNumber ||
    gameInfo?.loanInfo?.userID === currentUser?.id;

  useEffect(() => {
    setTime(gameInfo?.timer);

    if (isActive) {
      const interval = setInterval(() => {
        setTime((p) => p! - 1);
      }, 1000);

      return () => {
        clearInterval(interval);
      };
    }
  }, [gameInfo]);

  useEffect(() => {
    if (!isActive || time !== 0) return;

    if (currentUser?.cards?.length === 6) {
      if (gameInfo?.loanInfo?.userID === currentUser?.id) {
        // 론 버리기
        const body: LoanFailedBody = {
          cardID: gameInfo?.loanInfo?.cardID,
          playTurn: gameInfo?.playTurn,
          targetUserID: gameInfo?.loanInfo.targetUserID,
        };

        const req: LoanFailedRequest = {
          roomID: Number(roomID),
          message: JSON.stringify(body),
          event: FAILED_LOAN,
        };

        ws?.send(JSON.stringify(req));

        audios?.cardChapAudio.play();
        return;
      } else {
        // 카드를 하나 골라 6개가 되었지만 버리는 도중 타임아웃
        // 일반 버리기
        const [randomCard] = getRandomElements(currentUser.cards, 1);

        const body: DiscardBody = {
          cardID: randomCard.cardID,
          playTurn: gameInfo?.playTurn as number,
        };

        const request: DiscardRequest = {
          userID: currentUser?.id,
          event: DISCARD,
          roomID: Number(roomID),
          message: JSON.stringify(body),
        };

        ws?.send(JSON.stringify(request));

        audios?.cardChapAudio.play();
        return;
      }
    }

    if (gameInfo?.dora === null) {
      // dora 랜덤 선택
      const [randomCard] = getRandomElements(leftCards, 1);

      const requestBody: DORABody = {
        cardID: randomCard.id,
        playTurn: gameInfo.playTurn,
      };

      const request: DORARequest = {
        userID: currentUser?.id!,
        roomID: Number(roomID),
        event: DORA,
        message: JSON.stringify(requestBody),
      };

      ws?.send(JSON.stringify(request));
      audios?.cardChapAudio.play();
      return;
    }

    if (currentUser?.cards === null) {
      // 카드 5개 선택
      const randomCards = getRandomElements(leftCards, 5);

      const body: ImportCardBody = {
        cards: randomCards.map((ic) => ({
          cardID: ic.id,
        })),
        playTurn: gameInfo?.playTurn as number,
      };

      const request: ImportRequest = {
        userID: currentUser?.id,
        event: IMPORT_CARDS,
        roomID: Number(roomID),
        message: JSON.stringify(body),
      };

      ws?.send(JSON.stringify(request));
      setSelectedCards([]);
      audios?.cardChapAudio.play();
      return;
    } else {
      // 카드를 고르지않고 타임아웃
      // 카드 1개 선택해서 바로 버리기
      const [randomCard] = getRandomElements(leftCards, 1);

      if (!randomCard) {
        // 남은 카드 없는경우 (무승부)
        const req: GameOverRequest = {
          roomID: Number(roomID),
          message: "",
          event: GAME_OVER,
          userID: currentUser?.id!,
        };

        ws?.send(JSON.stringify(req));
        return;
      }

      const body: DiscardBody = {
        cardID: randomCard.id,
        playTurn: gameInfo?.playTurn as number,
      };

      const request: TimeoutDiscardRequest = {
        userID: currentUser?.id!,
        event: TIME_OUT_DISCARD,
        roomID: Number(roomID),
        message: JSON.stringify(body),
      };

      ws?.send(JSON.stringify(request));
      setSelectedCards([]);
      audios?.cardChapAudio.play();
      return;
    }
  }, [time]);

  return <div>{isActive && <p>{time}</p>}</div>;
};

export default Timer;
