import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { deleteCookie, getCookie, setCookie } from "cookies-next";
import { INTERNAL_DB, TOKEN_BAD } from "@/utils/constants/errTypes";

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

export type ScoreResult = {
  bonuses: string[];
  score: number;
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

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (e) => {
    const error = e as AxiosError<ErrorType>;

    // db error
    if (error.response && error.response.data.errType === INTERNAL_DB) {
      window.location.href = "/error";
    }

    // token error
    if (error.response && error.response.data.errType === TOKEN_BAD) {
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
