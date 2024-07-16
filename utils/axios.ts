import axios from "axios";

export type SignInType = {
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

export default axiosInstance;
