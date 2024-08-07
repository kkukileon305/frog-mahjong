"use client";

import Link from "next/link";
import React from "react";

const EnterFailedDiv = () => {
  return (
    <div className="flex h-[calc(100vh-64px)] bg-gray-200 justify-center items-center">
      <div className="p-4 w-full max-w-3xl bg-white rounded-xl flex justify-center items-center flex-col">
        <p className="font-bold text-3xl">비밀번호가 잘못되었습니다</p>
        <Link
          className="py-2 px-4 mt-4 border border-blue-400 rounded-xl text-blue-400 font-bold"
          href={"/rooms"}
        >
          돌아가기
        </Link>
      </div>
    </div>
  );
};

export default EnterFailedDiv;
