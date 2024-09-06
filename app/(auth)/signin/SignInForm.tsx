"use client";

import { SubmitHandler, useForm } from "react-hook-form";
import { useState } from "react";
import Link from "next/link";
import axiosInstance, { ErrorType, TokenType } from "@/utils/axios";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { setCookie } from "cookies-next";
import { USER_NOT_FOUND } from "@/utils/errTypes";
import { PASSWORD_NOT_MATCH } from "@/utils/const";
import { useTranslations } from "next-intl";

type SignInInputs = {
  email: string;
  password: string;
};

const SignInForm = () => {
  const m = useTranslations("SignIn");

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
        data: { accessToken, refreshToken, userID },
      } = await axiosInstance.post<TokenType>("/v0.1/auth/signin", {
        email: inputs.email,
        password: inputs.password,
      });

      const today = new Date();

      setCookie("accessToken", accessToken, {
        expires: new Date(today.getTime() + 3600000 * 24 * 7),
      });

      setCookie("refreshToken", refreshToken, {
        expires: new Date(today.getTime() + 3600000 * 24 * 7),
      });

      setCookie("userID", userID, {
        expires: new Date(today.getTime() + 3600000 * 24 * 7),
      });

      router.refresh();
      router.push("/rooms");
    } catch (e) {
      const error = e as AxiosError<ErrorType>;

      // login failed
      if (
        error.response?.data.errType === USER_NOT_FOUND ||
        error.response?.data.errType === PASSWORD_NOT_MATCH
      ) {
        setIsSignInFailed(true);
      }
      setIsLoading(false);
    }
  };

  return (
    <form
      className="flex flex-col gap-8 py-4 rounded-xl"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex flex-col">
        <label>{m("email")}</label>
        <input
          type="email"
          className={`border border-gray-400 rounded p-2 mt-3 ${
            errors.email && "border-red-400"
          }`}
          {...register("email", {
            required: m("writeEmail"),
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: m("checkEmail"),
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
        <label>{m("password")}</label>
        <input
          type="password"
          className={`border border-gray-400 rounded p-2 mt-3 ${
            errors.password && "border-red-400"
          }`}
          {...register("password", {
            required: m("writePassword"),
          })}
        />
        {errors.password && (
          <span className="text-sm text-red-400 mt-2">
            {errors.password.message}
          </span>
        )}
        <div className="flex justify-end mt-1">
          <Link href="/forgot-password" className="underline text-gray-600">
            {m("forgotPassword")}
          </Link>
        </div>
      </div>

      {isSignInFailed && (
        <p className="text-sm text-red-400 text-center">{m("failSignIn")}</p>
      )}

      <button
        type="submit"
        className="w-full bg-sky-500 rounded-lg py-3 text-white font-bold disabled:bg-gray-400"
        disabled={isLoading}
      >
        {m("signIn")}
      </button>
    </form>
  );
};

export default SignInForm;
