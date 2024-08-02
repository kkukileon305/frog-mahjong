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

export interface JOINResponseBody {
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
  dora: null;
  allReady: boolean;
}

export interface UserSocket {
  id: number;
  email: string;
  name: string;
  playerState: string;
  isOwner: boolean;
  cards: null;
  discardedCards: null;
  coin: number;
  turnNumber: number;
}
