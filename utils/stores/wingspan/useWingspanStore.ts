import { create } from "zustand";
import {
  ChatResponse,
  SocketResponseBody,
  UserSocket,
} from "@/utils/constants/wingspan/socketTypes";
import { devtools } from "zustand/middleware";
import { BirdCard, Mission } from "@/utils/axios";

type ChatWithValid = ChatResponse & {
  valid: boolean;
};

type Pickable = {
  isPickable: boolean;
  card: BirdCard | null;
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

  winner: number;
  setWinner: (winner: number) => void;

  chatList: ChatWithValid[];
  addChat: (chat: ChatResponse) => void;
  filterChat: (chat: ChatResponse) => void;

  isGameEnd: boolean;
  setIsGameEnd: (isGameEnd: boolean) => void;

  allMissions: Mission[];
  setAllMissions: (allMissions: Mission[]) => void;

  currentMissions: Mission[];
  setCurrentMissions: (currentMissions: Mission[]) => void;

  isPickCardsModal: boolean;
  setIsPickCardsModal: (isPickCardsModal: boolean) => void;

  cards: BirdCard[];
  setCards: (cards: BirdCard[]) => void;

  isTurnOver: boolean;
  setIsTurnOver: (isTurnOver: boolean) => void;

  isVictoryFailed: boolean;
  setIsVictoryFailed: (isVictoryFailed: boolean) => void;

  victoryFailedModal: boolean;
  setVictoryFailedModal: (victoryFailedModal: boolean) => void;

  clearMissionIDs: number[];
  setClearMissionIDs: (isClearMissionIDs: number[]) => void;

  isRouletteLoading: boolean;
  setIsRouletteLoading: (isRouletteLoading: boolean) => void;

  timer: number;
  setTimer: (timer: number) => void;

  timerId: ReturnType<typeof setInterval> | null;
  setTimerId: (timerId: ReturnType<typeof setInterval>) => void;

  isTimeOut: boolean;
  setIsTimeOut: (isTimeOut: boolean) => void;

  pickable: Pickable;
  setPickable: (pickable: Pickable) => void;

  isHelpModalOpen: boolean;
  setIsHelpModalOpen: (isHelpModalOpen: boolean) => void;

  isUseItem: boolean;
  setIsUseItem: (isUseItem: boolean) => void;

  sessionID: string | null;
  setSessionID: (setIsUseItem: string) => void;

  disconnectedUsers: UserSocket[];
  setDisconnectedUsers: (disconnectedUser: UserSocket[]) => void;

  isSettingModalOpen: boolean;
  setIsSettingModal: (isSettingModalOpen: boolean) => void;

  isGameOver: boolean;
  setIsGameOver: (isGameOver: boolean) => void;

  clear: () => void;
}

const useWingspanStore = create(
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

    winner: 0,
    setWinner: (winner: number) => set({ winner }),

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

    allMissions: [],
    setAllMissions: (allMissions: Mission[]) => set({ allMissions }),

    currentMissions: [],
    setCurrentMissions: (currentMissions) => set({ currentMissions }),

    isPickCardsModal: false,
    setIsPickCardsModal: (isPickCardsModal) => set({ isPickCardsModal }),

    cards: [],
    setCards: (cards) => set({ cards }),

    isTurnOver: false,
    setIsTurnOver: (isTurnOver) => set({ isTurnOver }),

    isVictoryFailed: false,
    setIsVictoryFailed: (isVictoryFailed: boolean) => set({ isVictoryFailed }),

    victoryFailedModal: false,
    setVictoryFailedModal: (victoryFailedModal: boolean) =>
      set({ victoryFailedModal }),

    clearMissionIDs: [],
    setClearMissionIDs: (clearMissionIDs) => set({ clearMissionIDs }),

    timer: 0,
    setTimer: (timer: number) => set({ timer }),

    timerId: null,
    setTimerId: (timerId) => set({ timerId }),

    isTimeOut: false,
    setIsTimeOut: (isTimeOut) => set({ isTimeOut }),

    isRouletteLoading: false,
    setIsRouletteLoading: (isRouletteLoading: boolean) =>
      set({ isRouletteLoading }),

    pickable: {
      isPickable: true,
      card: null,
    },
    setPickable: (pickable) => set({ pickable }),

    isHelpModalOpen: false,
    setIsHelpModalOpen: (isHelpModalOpen) => set({ isHelpModalOpen }),

    isUseItem: false,
    setIsUseItem: (isUseItem: boolean) => set({ isUseItem }),

    sessionID: null,
    setSessionID: (sessionID) => set({ sessionID }),

    disconnectedUsers: [],
    setDisconnectedUsers: (disconnectedUsers) => set({ disconnectedUsers }),

    isSettingModalOpen: false,
    setIsSettingModal: (isSettingModalOpen) => set({ isSettingModalOpen }),

    isGameOver: false,
    setIsGameOver: (isGameOver) => set({ isGameOver }),

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
        winner: 0,
        isMatchingCompleted: false,
        isGameEnd: false,
        isPickCardsModal: false,
        victoryFailedModal: false,
        isVictoryFailed: false,
        isTurnOver: false,
        clearMissionIDs: [],
        isRouletteLoading: false,
        isTimeOut: false,
        isHelpModalOpen: false,
        isUseItem: false,
        sessionID: null,
        timerId: null,
        currentMissions: [],
        disconnectedUsers: [],
        isSettingModalOpen: false,
        isGameOver: false,
      }),
  }))
);

export default useWingspanStore;
