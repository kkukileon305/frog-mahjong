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

export interface JOINResponseBody {
  users: UserSocket[];
  gameInfo: GameInfo;
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
