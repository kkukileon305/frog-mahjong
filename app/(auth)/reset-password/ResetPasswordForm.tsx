"use client";

import { SubmitHandler, useForm } from "react-hook-form";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

type ResetPasswordInputs = {
  password: string;
  resetToken: string;
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

  const onSubmit: SubmitHandler<ResetPasswordInputs> = async (inputs) => {
    setIsLoading(true);

    try {
      // TODO: リセットコード作成

      router.push("reset-password/done");
    } catch (e) {
      // TODO: 失敗したときのコード
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
        <label>{m("verifyCode")}</label>
        <input
          type="password"
          className={`border border-gray-400 rounded p-2 mt-3 ${
            errors.resetToken && "border-red-400"
          }`}
          {...register("resetToken", {
            required: m("writeCode"),
          })}
        />
        {errors.resetToken && (
          <span className="text-sm text-red-400 mt-2">
            {errors.resetToken.message}
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
