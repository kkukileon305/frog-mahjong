"use client";

import { SubmitHandler, useForm } from "react-hook-form";
import { useState } from "react";
import Link from "next/link";
import axiosInstance, { ErrorType, TokenType } from "@/utils/axios";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { setCookie } from "cookies-next";
import { USER_NOT_FOUND } from "@/utils/errTypes";

type SignInInputs = {
  email: string;
  password: string;
};

const SignInForm = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInInputs>();

  const [isSignInFailed, setIsSignInFailed] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit: SubmitHandler<SignInInputs> = async (inputs) => {
    setIsLoading(true);

    try {
      const {
        data: { accessToken, refreshToken },
      } = await axiosInstance.post<TokenType>("/v0.1/auth/signin", {
        email: inputs.email,
        password: inputs.password,
      });

      const today = new Date();

      setCookie("accessToken", accessToken, {
        expires: new Date(today.getTime() + 3600000 * 24 * 1),
      });

      setCookie("refreshToken", refreshToken, {
        expires: new Date(today.getTime() + 3600000 * 24 * 7),
      });

      router.push("/");
      router.refresh();
    } catch (e) {
      const error = e as AxiosError<ErrorType>;

      // login failed
      if (error.response?.data.errType === USER_NOT_FOUND) {
        setIsSignInFailed(true);
      }
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
        <label>이메일</label>
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

      <div className="flex flex-col">
        <label>비밀번호</label>
        <input
          type="password"
          className={`border border-gray-400 rounded p-2 mt-3 ${
            errors.password && "border-red-400"
          }`}
          {...register("password", {
            required: "비밀번호를 입력해주세요",
          })}
        />
        {errors.password && (
          <span className="text-sm text-red-400 mt-2">
            {errors.password.message}
          </span>
        )}
        <div className="flex justify-end mt-1">
          <Link href="/forgot-password" className="underline text-gray-600">
            비밀번호를 잊으셨나요?
          </Link>
        </div>
      </div>

      {isSignInFailed && (
        <p className="text-sm text-red-400 text-center">
          비밀번호가 틀렸거나 없는 회원입니다
        </p>
      )}

      <button
        type="submit"
        className="w-full bg-sky-500 rounded-lg py-3 text-white font-bold disabled:bg-gray-400"
        disabled={isLoading}
      >
        로그인
      </button>
    </form>
  );
};

export default SignInForm;
