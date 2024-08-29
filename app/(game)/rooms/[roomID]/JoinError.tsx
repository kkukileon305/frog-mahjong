import Link from "next/link";
import React from "react";

type JoinErrorProps = {
  isPasswordFailed: boolean;
  isProgress: boolean;
  isFullPlayer: boolean;
  isNoRoom: boolean;
};

const JoinError = ({
  isPasswordFailed,
  isProgress,
  isFullPlayer,
  isNoRoom,
}: JoinErrorProps) => {
  const pwErrorMessage = "비밀번호가 잘못되었습니다";
  const progressMessage = "이미 진행중입니다";
  const fullPlayerMessage = "플레이어가 가득 찼습니다";
  const noRoomMessage = "이미 사라진 방입니다";

  return (
    <div className="flex h-[calc(100vh)] bg-gray-200 justify-center items-center">
      <div className="p-4 w-full max-w-3xl bg-white rounded-xl flex justify-center items-center flex-col">
        <p className="font-bold text-3xl">
          {isPasswordFailed && pwErrorMessage}
          {isProgress && progressMessage}
          {isFullPlayer && fullPlayerMessage}
          {isNoRoom && noRoomMessage}
        </p>
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

export default JoinError;
