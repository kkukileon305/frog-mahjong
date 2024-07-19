"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import axiosInstance from "@/utils/axios";

const Page = () => {
  const searchParams = useSearchParams();
  const code = searchParams.get("code");

  const onSignInWithCode = async () => {
    console.log(code);

    try {
      // TODO: グーグルコードを送る
      // const {} = await axiosInstance.post("")
    } catch (e) {}
  };

  useEffect(() => {
    onSignInWithCode();
  }, []);

  return (
    <div>
      <div className="mx-auto max-w-3xl min-h-[calc(100vh-64px)] flex justify-center items-center">
        <p className="text-3xl font-bold">인증중</p>
      </div>
    </div>
  );
};

export default Page;
