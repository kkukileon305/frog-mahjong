export interface CLOSERequest {
  roomID: number;
  event: "CLOSE";
  message: string;
}

export interface JOINRequest {
  roomID: number;
  event: "JOIN";
  message: string;
}

export interface READYRequest {
  roomID: number;
  event: "READY";
  message: string;
}

export interface READYCANCELRequest {
  roomID: number;
  event: "READY_CANCEL";
  message: string;
}

export interface STARTRequest {
  roomID: number;
  event: "START";
  message: string;
}

export interface DORARequest {
  userID: number;
  roomID: number;
  event: "DORA";
  message: string;
}

export interface DORABody {
  cards: {
    cardID: number;
  }[];
  playTurn: number;
}

export interface SocketResponseBody {
  users: UserSocket[] | null;
  gameInfo: GameInfo;
  errorInfo?: ErrorInfo;
}

export interface ErrorInfo {
  code: number;
  msg: string;
}

export interface GameInfo {
  playTurn: number;
  dora: null | SelectedDora;
  allReady: boolean;
}

export interface SelectedDora {
  cardID: number;
  userID: number;
}

export interface ImportCardBody {
  cards: {
    cardID: number;
  }[];
  playTurn: number;
}

export interface UserSocket {
  id: number;
  email: string;
  name: string;
  playerState: string;
  isOwner: boolean;
  cards: null | UserCard[];
  discardedCards: null | UserCard[];
  coin: number;
  turnNumber: number;
}

export type UserCard = {
  cardID: number;
  userID: number;
};
