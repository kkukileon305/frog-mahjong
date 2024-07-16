"use client";

import { SubmitHandler, useForm } from "react-hook-form";
import { useState } from "react";
import { useRouter } from "next/navigation";

type ResetPasswordInputs = {
  password: string;
  resetToken: string;
};

const ResetPasswordForm = () => {
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
        <label>인증번호</label>
        <input
          type="password"
          className={`border border-gray-400 rounded p-2 mt-3 ${
            errors.resetToken && "border-red-400"
          }`}
          {...register("resetToken", {
            required: "인증번호를 입력해주세요",
          })}
        />
        {errors.resetToken && (
          <span className="text-sm text-red-400 mt-2">
            {errors.resetToken.message}
          </span>
        )}
      </div>

      <div className="flex flex-col">
        <label>비밀번호 (영문, 숫자 조합 6자리 이상)</label>
        <input
          type="password"
          className={`border border-gray-400 rounded p-2 mt-3 ${
            errors.password && "border-red-400"
          }`}
          {...register("password", {
            required: "비밀번호를 입력해주세요",
            pattern: {
              value: /^(?=.*?[0-9])(?=.*?[a-z]).{6,}$/,
              message: "비밀번호를 영문, 숫자 조합 6자리 이상으로 적어주세요",
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
          비밀번호 재설정
        </button>
      </div>
    </form>
  );
};

export default ResetPasswordForm;
