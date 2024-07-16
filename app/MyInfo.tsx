"use client";

import { useRouter } from "next/navigation";
import { deleteCookie } from "cookies-next";

const MyInfo = () => {
  const router = useRouter();

  const signOut = () => {
    deleteCookie("accessToken");
    deleteCookie("refreshToken");

    router.push("/signin");
    router.refresh();
  };

  return <button onClick={signOut}>로그아웃</button>;
};

export default MyInfo;
