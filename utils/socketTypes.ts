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
  cardID: number;
  playTurn: number;
}

export interface SocketResponseBody {
  users: UserSocket[] | null;
  gameInfo?: GameInfo;
  errorInfo?: ErrorInfo;
}

export interface ErrorInfo {
  code: number;
  msg: string;
  type: string;
}

export interface GameInfo {
  playTurn: number;
  dora: null | SelectedDora;
  allReady: boolean;
  isLoanAllowed: boolean;
  loanInfo: LoanInfo | null;
}

export interface LoanInfo {
  userID: number;
  targetUserID: number;
  cardID: 33;
}

export interface SelectedDora {
  cardID: number;
  userID: number;
}

export interface ImportRequest {
  userID: number;
  roomID: number;
  event: "IMPORT_CARDS";
  message: string;
}

export interface ImportCardBody {
  cards: {
    cardID: number;
  }[];
  playTurn: number;
}

export interface ImportSingleCardRequest {
  userID: number;
  roomID: number;
  event: "IMPORT_SINGLE_CARD";
  message: string;
}

export interface ImportSingleCardBody {
  cardID: number;
  playTurn: number;
}

export interface DiscardRequest {
  userID: number;
  roomID: number;
  event: "DISCARD";
  message: string;
}

export interface DiscardBody {
  cardID: number;
  playTurn: number;
}

export interface RequestWin {
  userID: number;
  roomID: number;
  event: "REQUEST_WIN";
  message: string;
}

export interface RequestWinBody {
  cards: {
    cardID: number;
  }[];
  playTurn: number;
  score: number;
}

export interface LoanRequest {
  roomID: number;
  event: "LOAN";
  message: string;
}

export interface LoanBody {
  cardID: number;
  targetUserID: number;
  playTurn: number;
}

export interface LoanFailedRequest {
  roomID: number;
  event: "FAILED_LOAN";
  message: string;
}

export interface LoanFailedBody {
  cardID: number;
  targetUserID: number;
  playTurn: number;
}

export interface GameOverRequest {
  userID: number;
  roomID: number;
  event: "GAME_OVER";
  message: "";
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
