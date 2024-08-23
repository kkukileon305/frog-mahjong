import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { deleteCookie, getCookie, setCookie } from "cookies-next";
import { INTERNAL_DB, TOKEN_BAD } from "@/utils/errTypes";

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
          expires: new Date(today.getTime() + 3600000 * 24 * 1),
        });

        setCookie("refreshToken", data.refreshToken, {
          expires: new Date(today.getTime() + 3600000 * 24 * 7),
        });

        // 以前リクエスト中でデータ(body)だけを変更して再リクエストする
        const newConfig = error.config as InternalAxiosRequestConfig;

        newConfig.headers.tkn = data.accessToken;

        newConfig.data = {
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
        };

        return axios.request(newConfig);
      } catch (e) {
        // refresh 消滅　=> logout
        deleteCookie("accessToken");
        deleteCookie("refreshToken");

        window.location.href = "/signin";
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
