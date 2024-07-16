"use client";

import { SubmitHandler, useForm } from "react-hook-form";
import { useState } from "react";

type SignUpInputs = {
  email: string;
  name: string;
  password: string;
};

const SignUpForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpInputs>();

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit: SubmitHandler<SignUpInputs> = async (inputs) => {
    setIsLoading(true);

    try {
      // TODO: 加入コード作成
    } catch (e) {
      // TODO: 失敗したときのコード
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      className="flex flex-col gap-8 bg-gray-200 p-4 rounded-xl"
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

      <div className="flex flex-col">
        <label>이름</label>
        <input
          className={`border border-gray-400 rounded p-2 mt-3 ${
            errors.name && "border-red-400"
          }`}
          {...register("name", {
            required: "이름을 입력해주세요",
          })}
        />
        {errors.name && (
          <span className="text-sm text-red-400 mt-2">
            {errors.name.message}
          </span>
        )}
      </div>

      <div>
        <p className="text-sm text-gray-800 mb-2">
          회원가입시 <span className="underline">이용약관</span>에 동의한 것으로
          간주됩니다.
        </p>
        <button
          type="submit"
          className="w-full bg-sky-500 rounded-lg py-4 text-white font-bold disabled:bg-gray-400"
          disabled={isLoading}
        >
          회원가입
        </button>
      </div>
    </form>
  );
};

export default SignUpForm;
