"use client";

import { SubmitHandler, useForm } from "react-hook-form";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import axiosInstance from "@/utils/axios";

type ResetPasswordInputs = {
  password: string;
  code: string;
  email: string;
};

const ResetPasswordForm = () => {
  const m = useTranslations("ResetPassword");

  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordInputs>();

  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const onSubmit: SubmitHandler<ResetPasswordInputs> = async (inputs) => {
    setIsLoading(true);

    try {
      await axiosInstance.post("/v0.1/auth/password/validate", {
        email: inputs.email,
        password: inputs.password,
        code: inputs.code,
      });

      router.push("reset-password/done");
    } catch (e) {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      className="flex flex-col gap-8 rounded-xl"
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
        <label>{m("verifyCode")}</label>
        <input
          type="password"
          className={`border border-gray-400 rounded p-2 mt-3 ${
            errors.code && "border-red-400"
          }`}
          {...register("code", {
            required: m("writeCode"),
          })}
        />
        {errors.code && (
          <span className="text-sm text-red-400 mt-2">
            {errors.code.message}
          </span>
        )}
      </div>

      <div className="flex flex-col">
        <label>{m("newPassword")}</label>
        <input
          type="password"
          className={`border border-gray-400 rounded p-2 mt-3 ${
            errors.password && "border-red-400"
          }`}
          {...register("password", {
            required: m("writePassword"),
            pattern: {
              value: /^(?=.*?[0-9])(?=.*?[a-z]).{6,}$/,
              message: m("checkPassword"),
            },
          })}
        />
        {errors.password && (
          <span className="text-sm text-red-400 mt-2">
            {errors.password.message}
          </span>
        )}
      </div>

      {isError && (
        <span className="text-sm text-red-400 mt-2 text-center">
          {m("error")}
        </span>
      )}

      <div>
        <button
          type="submit"
          className="w-full bg-sky-500 rounded-lg py-3 text-white font-bold disabled:bg-gray-400"
          disabled={isLoading}
        >
          {m("resetPassword")}
        </button>
      </div>
    </form>
  );
};

export default ResetPasswordForm;
