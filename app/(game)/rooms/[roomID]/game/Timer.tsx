"use client";

import {
  DiscardBody,
  DiscardRequest,
  DORABody,
  DORARequest,
  GameInfo,
  GameOverRequest,
  ImportCardBody,
  ImportRequest,
  ImportSingleCardBody,
  ImportSingleCardRequest,
  LoanFailedBody,
  LoanFailedRequest,
  UserSocket,
} from "@/utils/socketTypes";
import { CardImage } from "@/app/(game)/rooms/[roomID]/game/cards";
import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { getCookie } from "cookies-next";
import cardChapWavSrc from "@/public/audios/card_chap.wav";
import { useParams } from "next/navigation";
import getRandomElements from "@/utils/getRandomElements";
import {
  DISCARD,
  DORA,
  FAILED_LOAN,
  GAME_OVER,
  IMPORT_CARDS,
  IMPORT_SINGLE_CARD,
} from "@/utils/const";

type TimerProps = {
  ws: WebSocket | null;
  gameInfo: GameInfo;
  users: UserSocket[] | null;
  leftCards: CardImage[];
  setSelectedCards: Dispatch<SetStateAction<CardImage[]>>;
};

const Timer = ({
  ws,
  leftCards,
  gameInfo,
  users,
  setSelectedCards,
}: TimerProps) => {
  const { roomID } = useParams<{ roomID: string }>();

  const cardChapAudioRef = useRef<HTMLAudioElement>(null);
  const [time, setTime] = useState(gameInfo.timeOut);

  const userID = getCookie("userID") as string;
  const currentUser = users?.find((user) => user.id === Number(userID));

  const isActive =
    gameInfo.playTurn === currentUser?.turnNumber ||
    gameInfo.loanInfo?.userID === currentUser?.id;

  useEffect(() => {
    setTime(gameInfo.timeOut);

    if (isActive) {
      const interval = setInterval(() => {
        setTime((p) => p - 1);
      }, 1000);

      return () => {
        clearInterval(interval);
      };
    }
  }, [gameInfo]);

  useEffect(() => {
    if (!isActive || time !== 0) return;

    if (currentUser?.cards?.length === 6) {
      if (gameInfo.loanInfo?.userID === currentUser?.id) {
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

        cardChapAudioRef.current?.play();
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

        cardChapAudioRef.current?.play();
        return;
      }
    }

    if (gameInfo.dora === null) {
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
      cardChapAudioRef.current?.play();
      return;
    }

    if (currentUser?.cards === null) {
      // 카드 5개 선택
      const randomCards = getRandomElements(leftCards, 5);

      const body: ImportCardBody = {
        cards: randomCards.map((ic) => ({
          cardID: ic.id,
        })),
        playTurn: gameInfo.playTurn as number,
      };

      const request: ImportRequest = {
        userID: currentUser?.id,
        event: IMPORT_CARDS,
        roomID: Number(roomID),
        message: JSON.stringify(body),
      };

      ws?.send(JSON.stringify(request));
      setSelectedCards([]);
      cardChapAudioRef.current?.play();
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

      const request: DiscardRequest = {
        userID: currentUser?.id!,
        event: DISCARD,
        roomID: Number(roomID),
        message: JSON.stringify(body),
      };

      ws?.send(JSON.stringify(request));

      cardChapAudioRef.current?.play();
      return;
    }
  }, [time]);

  return (
    <>
      <div>{isActive && <p>{time}</p>}</div>
      <audio src={cardChapWavSrc} hidden ref={cardChapAudioRef} />
    </>
  );
};

export default Timer;
