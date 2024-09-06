"use client";

import { SubmitHandler, useForm } from "react-hook-form";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axiosInstance, { ErrorType } from "@/utils/axios";
import { AxiosError } from "axios";
import { USER_ALREADY_EXISTED } from "@/utils/errTypes";
import { useTranslations } from "next-intl";

type SignUpInputs = {
  email: string;
  name: string;
  password: string;
};

const SignUpForm = () => {
  const m = useTranslations("SignUp");

  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpInputs>();

  const [isAlreadyRegistered, setIsAlreadyRegistered] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit: SubmitHandler<SignUpInputs> = async (inputs) => {
    setIsLoading(true);

    try {
      await axiosInstance.post("/v0.1/auth/signup", {
        email: inputs.email,
        password: inputs.password,
        name: inputs.name,
      });

      router.push("signup/done");
    } catch (e) {
      const error = e as AxiosError<ErrorType>;

      // user already exist
      if (error.response?.data.errType === USER_ALREADY_EXISTED) {
        setIsAlreadyRegistered(true);
      }

      setIsLoading(false);
    }
  };

  return (
    <form
      className="flex flex-col gap-8 bg-gray-200 p-4 rounded-xl"
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

      <div className="flex flex-col">
        <label>{m("name")}</label>
        <input
          className={`border border-gray-400 rounded p-2 mt-3 ${
            errors.name && "border-red-400"
          }`}
          {...register("name", {
            required: m("writeName"),
          })}
        />
        {errors.name && (
          <span className="text-sm text-red-400 mt-2">
            {errors.name.message}
          </span>
        )}
      </div>

      {isAlreadyRegistered && (
        <p className="text-sm text-red-400 text-center">{m("alreadySignUp")}</p>
      )}
      <div>
        <p className="text-sm text-gray-800 mb-2">
          {m("agree1")}
          <span className="underline">{m("agree2")}</span>
          {m("agree3")}
        </p>

        <button
          type="submit"
          className="w-full bg-sky-500 rounded-lg py-3 text-white font-bold disabled:bg-gray-400"
          disabled={isLoading}
        >
          {m("signUp")}
        </button>
      </div>
    </form>
  );
};

export default SignUpForm;
