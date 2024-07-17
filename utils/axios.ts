import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { deleteCookie, getCookie, setCookie } from "cookies-next";
import { Router } from "next/router";
import { TOKEN_BAD } from "@/utils/errTypes";

export type TokenType = {
  accessToken: string;
  refreshToken: string;
};

export type GetUserListType = {
  total: number;
  users: User[];
};

export interface User {
  email: string;
  name: string;
  score: number;
  state: string;
  userID: number;
}

export type ErrorType = {
  errType: string;
  msg: string;
};

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASEURL,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (e) => {
    const error = e as AxiosError<ErrorType>;

    if (error.response && error.response.data.errType === TOKEN_BAD) {
      const beforeAccessToken = getCookie("accessToken");
      const beforeRefreshToken = getCookie("refreshToken");

      try {
        const { data } = await axios.put<TokenType>(
          process.env.NEXT_PUBLIC_BASEURL + "/v0.1/auth/token/reissue",
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
  }
);

export default axiosInstance;
