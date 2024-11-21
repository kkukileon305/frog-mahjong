import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { deleteCookie, getCookie, setCookie } from "cookies-next";
import { INTERNAL_DB, TOKEN_BAD } from "@/utils/constants/errTypes";
import { PARAM_BAD } from "@/utils/constants/const";

export interface RoomsResponse {
  rooms: Room[];
  total: number;
}

export interface Room {
  created: number;
  currentCount: number;
  id: number;
  maxCount: number;
  minCount: number;
  name: string;
  ownerID: number;
  password: boolean;
  state: string;
}

export interface RoomCreatedResponse {
  roomID: number;
}

export interface UserData {
  email: string;
  name: string;
  userID: number;
  coin: number;
  errType?: string;
  profileID: number;
}

export type TokenType = {
  accessToken: string;
  refreshToken: string;
  userID: number;
};

export type ErrorType = {
  errType: string;
  msg: string;
};

export type ScoreEndResult = {
  bonuses: string[];
  score: number;
  winner: number;
};

export type ChatHistory = {
  chats: ChatHistoryBody[];
  total: number;
};

export type ChatHistoryBody = {
  created: string;
  id: number;
  message: string;
  name: string;
  userID: number;
};

export type FormMetadata = {
  timers: number[];
};

export type ReportMetadata = {
  categories: {
    id: number;
    reason: "string";
  }[];
};

export type CardListResponse = {
  cardIDList: number[];
};

export type BirdCard = {
  id: number;
  name: string;
  image: string;
  size: number;
  habitat: string;
  beakDirection: BeakDirection;
  nest: Nest;
};

export enum BeakDirection {
  Center = "center",
  Left = "left",
  Right = "right",
}

export enum Nest {
  Bowl = "bowl",
  Cavity = "cavity",
  Ground = "ground",
  Platform = "platform",
  Wild = "wild",
}

export interface ImportCardBody {
  cards: BirdCard[];
}

export type AvailableProfileIcon = {
  currentCount: number;
  isAchieved: boolean;
  profileID: number;
};

export type AvailableProfileIconResponse = {
  profiles: AvailableProfileIcon[] | null;
};

export type Mission = {
  id: number;
  title: string;
};

export type MissionResponse = {
  missions: Mission[];
};

export interface Result {
  missions: MissionResult[];
  winner: number;
}

export interface MissionResult {
  cards: number[];
  missionID: number;
}

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (e) => {
    const error = e as AxiosError<ErrorType>;

    if (!error.response) {
      window.location.href = "/maintenance";
      return;
    }

    // db error
    if (error.response && error.response.data.errType === INTERNAL_DB) {
      window.location.href = "/error";
    }

    // token error
    if (
      error.response &&
      (error.response.data.errType === TOKEN_BAD ||
        error.response.data.errType === PARAM_BAD)
    ) {
      const beforeAccessToken = getCookie("accessToken");
      const beforeRefreshToken = getCookie("refreshToken");

      try {
        const { data } = await axios.put<TokenType>(
          process.env.NEXT_PUBLIC_BACKEND_URL + "/v0.1/auth/token/reissue",
          {
            accessToken: beforeAccessToken,
            refreshToken: beforeRefreshToken,
          }
        );

        const today = new Date();

        setCookie("accessToken", data.accessToken, {
          expires: new Date(today.getTime() + 3600000 * 24 * 7),
        });

        setCookie("refreshToken", data.refreshToken, {
          expires: new Date(today.getTime() + 3600000 * 24 * 7),
        });
        const newConfig = error.config as InternalAxiosRequestConfig;

        newConfig.headers.tkn = data.accessToken;

        newConfig.data = {
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
        };

        return axios.request(newConfig);
      } catch (e) {
        deleteCookie("accessToken");
        deleteCookie("refreshToken");
        deleteCookie("userID");

        window.location.href = "/signin";
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
