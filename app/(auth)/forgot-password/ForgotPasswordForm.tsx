"use client";

import { SubmitHandler, useForm } from "react-hook-form";
import { useState } from "react";
import Link from "next/link";

type SignInInputs = {
  email: string;
};

const ForgotPasswordForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInInputs>();

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit: SubmitHandler<SignInInputs> = async (inputs) => {
    setIsLoading(true);

    try {
      // TODO: ログインコード作成
    } catch (e) {
      // TODO: 失敗したときのコード
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      className="flex flex-col gap-8 py-4 rounded-xl"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex flex-col">
        <label>계정 이메일</label>
        <input
          type="email"
          className={`border border-gray-400 rounded p-2 mt-3 ${
            errors.email && "border-red-400"
          }`}
          {...register("email", {
            required: "이메일을 입력해주세요",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "올바른 이메일 주소를 입력해주세요",
            },
          })}
        />
        {errors.email && (
          <span className="text-sm text-red-400 mt-2">
            {errors.email.message}
          </span>
        )}
      </div>

      <button
        type="submit"
        className="w-full bg-sky-500 rounded-lg py-4 text-white font-bold disabled:bg-gray-400"
        disabled={isLoading}
      >
        비밀번호 재설정 이메일 받기
      </button>
    </form>
  );
};

export default ForgotPasswordForm;
