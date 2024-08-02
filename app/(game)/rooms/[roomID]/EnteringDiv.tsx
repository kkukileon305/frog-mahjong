"use client";

import React from "react";

const EnteringDiv = () => {
  return (
    <div className="flex h-[calc(100vh-64px)] bg-gray-200 justify-center items-center">
      <div className="p-4 w-full max-w-3xl bg-white rounded-xl flex justify-center items-center">
        <p className="font-bold text-3xl">접속중</p>
      </div>
    </div>
  );
};

export default EnteringDiv;
