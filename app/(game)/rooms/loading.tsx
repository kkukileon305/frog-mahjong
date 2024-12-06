import React from "react";

const Loading = () => {
  return (
    <div className="h-[calc(100dvh)] flex items-center max-w-2xl mx-auto p-2">
      <div className="h-[452px] w-full ">
        <div className="flex justify-center gap-2">
          <div className="w-12 aspect-square rounded-xl bg-gray-200 animate-pulse"></div>

          <div className="w-[150px] flex flex-col gap-1">
            <div className="bg-gray-200 animate-pulse h-1/2 rounded-xl" />
            <div className="bg-gray-200 animate-pulse h-1/2 rounded-xl" />
          </div>
        </div>

        <div className="mt-8">
          <div className="w-[200px] mx-auto h-9 bg-gray-200 animate-pulse rounded-xl mb-2" />
          <div className="h-11 bg-gray-200 animate-pulse rounded-xl mb-8" />
          <div className="w-[200px] mx-auto h-9 bg-gray-200 animate-pulse rounded-xl mb-2" />
          <div className="h-11 bg-gray-200 animate-pulse rounded-xl mb-8" />

          <div className="lg:px-8">
            <div className="h-11 bg-gray-200 animate-pulse rounded-xl mb-4" />
            <div className="flex gap-4 h-11">
              <div className="w-1/2 h-full bg-gray-200 animate-pulse rounded-xl" />
              <div className="w-1/2 h-full bg-gray-200 animate-pulse rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loading;
