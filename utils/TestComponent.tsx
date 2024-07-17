"use client";

import axiosInstance, { GetUserListType } from "@/utils/axios";
import { getCookie } from "cookies-next";

const TestComponent = () => {
  const accessToken = getCookie("accessToken");

  const onClick = async () => {
    try {
      const { data } = await axiosInstance.get<GetUserListType>("/v0.1/users", {
        headers: {
          tkn: accessToken,
        },
      });

      console.log(data.users);
    } catch (e) {}
  };

  return <button onClick={onClick}>btn</button>;
};

export default TestComponent;
