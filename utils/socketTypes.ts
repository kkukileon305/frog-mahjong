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
  cards: CardWithState[];
}

export interface CardWithState {
  name: string;
  color: string;
  state: string;
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
  name: string;
  color: string;
  state: string;
  userID: number;
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
