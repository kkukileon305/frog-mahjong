import axios from "axios";

export type ErrorType = {
  errType: string;
  msg: string;
};

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASEURL,
});

export default axiosInstance;
