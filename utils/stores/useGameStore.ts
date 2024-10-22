import { create } from "zustand";
import {
  ChatResponse,
  SocketResponseBody,
  UserSocket,
} from "@/utils/constants/old-frog-mahjong/socketTypes";
import { devtools } from "zustand/middleware";

type GameResult = {
  beforeUsers: UserSocket[] | null;
  afterUsers: UserSocket[] | null;
};

type ChatWithValid = ChatResponse & {
  valid: boolean;
};

interface GameStore {
  ws: WebSocket | null;
  setWs: (ws: WebSocket | null) => void;

  isMatching: boolean;
  setIsMatching: (isMatching: boolean) => void;

  isMatchingCompleted: boolean;
  setIsMatchingCompleted: (isMatchingCompleted: boolean) => void;

  isAbnormalExit: boolean;
  setIsAbnormalExit: (isAbnormalExit: boolean) => void;

  isLoanFailed: number;
  setIsLoanFailed: (isLoanFailed: number) => void;

  gameState: SocketResponseBody | null;
  setGameState: (gameState: SocketResponseBody | null) => void;

  isStarted: boolean;
  setIsStarted: (isStarted: boolean) => void;

  isOpenResultModal: boolean;
  setIsOpenResultModal: (isOpenResultModal: boolean) => void;

  isGetCard: boolean;
  setIsGetCard: (isGetCard: boolean) => void;

  kicked: boolean;
  setKicked: (kicked: boolean) => void;

  winner: UserSocket | null;
  setWinner: (winner: UserSocket | null) => void;

  chatList: ChatWithValid[];
  addChat: (chat: ChatResponse) => void;
  filterChat: (chat: ChatResponse) => void;

  result: GameResult;
  setResult: (result: GameResult) => void;
  setBeforeResult: (users: UserSocket[] | null) => void;
  setAfterResult: (users: UserSocket[] | null) => void;

  isGameEnd: boolean;
  setIsGameEnd: (isGameEnd: boolean) => void;

  clear: () => void;
}

const useGameStore = create(
  devtools<GameStore>((set) => ({
    ws: null as WebSocket | null,
    setWs: (ws: WebSocket | null) => set({ ws }),

    // match
    isMatching: false,
    setIsMatching: (isMatching: boolean) => set({ isMatching }),

    isMatchingCompleted: false,
    setIsMatchingCompleted: (isMatchingCompleted: boolean) =>
      set({ isMatchingCompleted }),

    // errors
    isAbnormalExit: false,
    setIsAbnormalExit: (isAbnormalExit: boolean) => set({ isAbnormalExit }),
    isLoanFailed: 0,
    setIsLoanFailed: (isLoanFailed: number) => set({ isLoanFailed }),

    // room state
    gameState: null as SocketResponseBody | null,
    setGameState: (gameState: SocketResponseBody | null) => set({ gameState }),

    isStarted: false,
    setIsStarted: (isStarted: boolean) => set({ isStarted }),

    isOpenResultModal: false,
    setIsOpenResultModal: (isOpenResultModal: boolean) =>
      set({ isOpenResultModal }),

    isGetCard: false,
    setIsGetCard: (isGetCard: boolean) => set({ isGetCard }),

    kicked: false,
    setKicked: (kicked: boolean) => set({ kicked }),

    winner: null as UserSocket | null,
    setWinner: (winner: UserSocket | null) => set({ winner }),

    // prev
    // results
    result: { beforeUsers: null, afterUsers: null } as GameResult,
    setResult: (result: GameResult) => set({ result }),
    setBeforeResult: (users) =>
      set({
        result: {
          beforeUsers: users,
          afterUsers: null,
        },
      }),
    setAfterResult: (users) =>
      set((prevState) => ({
        result: {
          beforeUsers: prevState.result.beforeUsers,
          afterUsers: users,
        },
      })),

    // chats
    chatList: [],
    addChat: (newChat: ChatResponse) =>
      set((prev) => ({
        chatList: [...prev.chatList, { ...newChat, valid: true }],
      })),
    filterChat: (targetChat: ChatResponse) =>
      set((prev) => ({
        chatList: prev.chatList.map((chat) =>
          chat.chatID === targetChat.chatID ? { ...chat, valid: false } : chat
        ),
      })),

    isGameEnd: false,
    setIsGameEnd: (isGameEnd) => set({ isGameEnd }),

    clear: () =>
      set({
        ws: null,
        isMatching: false,
        isAbnormalExit: false,
        gameState: null,
        isStarted: false,
        isOpenResultModal: false,
        isGetCard: false,
        kicked: false,
        winner: null,
        result: {
          beforeUsers: null,
          afterUsers: null,
        },
        isMatchingCompleted: false,
        isGameEnd: false,
      }),
  }))
);

export default useGameStore;
