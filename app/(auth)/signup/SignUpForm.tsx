"use client";

import { SubmitHandler, useForm } from "react-hook-form";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axiosInstance, { ErrorType } from "@/utils/axios";
import { AxiosError } from "axios";
import {
  INVALID_AUTH_CODE,
  USER_ALREADY_EXISTED,
} from "@/utils/constants/errTypes";
import { useTranslations } from "next-intl";
import Link from "next/link";

type SignUpInputs = {
  email: string;
  name: string;
  password: string;
  isOverAge: boolean;
  authCode: string;
};

const SignUpForm = () => {
  const m = useTranslations("SignUp");

  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    setError,
    clearErrors,
  } = useForm<SignUpInputs>();

  const [isAlreadyRegistered, setIsAlreadyRegistered] = useState(false);
  const [isAuthError, setIsAuthError] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const [isAlreadyRequested, setIsAlreadyRequested] = useState(false);
  const [isEmailLoading, setIsEmailLoading] = useState(false);
  const [isEmailError, setIsEmailError] = useState(false);

  const onSubmit: SubmitHandler<SignUpInputs> = async (inputs) => {
    setIsLoading(true);
    try {
      await axiosInstance.post("/v0.1/auth/signup", {
        email: inputs.email,
        password: inputs.password,
        name: inputs.name,
        authCode: inputs.authCode,
      });

      router.push("signup/done");
    } catch (e) {
      const error = e as AxiosError<ErrorType>;

      // user already exist
      if (error.response?.data.errType === USER_ALREADY_EXISTED) {
        setIsAlreadyRegistered(true);
      } else if (error.response?.data.errType === INVALID_AUTH_CODE) {
        setIsAuthError(true);
      }

      setIsLoading(false);
    }
  };

  const onClick = async () => {
    setIsEmailError(false);

    if (isAlreadyRequested) return;

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    const inputEmail = getValues("email");

    if (emailRegex.test(inputEmail)) {
      clearErrors("email");
      setIsEmailLoading(true);

      try {
        await axiosInstance.post("/v0.1/auth/signup/request", {
          email: inputEmail,
        });

        setIsAlreadyRequested(true);
        setIsEmailError(false);
      } catch (e) {
        setIsEmailError(true);
      } finally {
        setIsEmailLoading(false);
      }
    } else {
      if (inputEmail === "") {
        setError("email", {
          type: "required",
          message: m("writeEmail"),
        });
      } else {
        setError("email", {
          type: "required",
          message: m("checkEmail"),
        });
      }
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
          disabled={isAlreadyRequested}
          type="email"
          className={`border border-gray-400 rounded p-2 mt-3 disabled:bg-gray-200 ${
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

      {isEmailError && (
        <p className="text-sm text-red-400 text-center">{m("alreadySignUp")}</p>
      )}

      <button
        onClick={onClick}
        disabled={isEmailLoading || isAlreadyRequested}
        type="button"
        className="w-full bg-sky-500 rounded-lg py-3 text-white font-bold disabled:bg-gray-400"
      >
        {isAlreadyRequested ? m("alreadyRequestAuthCode") : m("sendAuthCode")}
      </button>

      {isAlreadyRequested && (
        <p className="text-sm text-blue-400 text-center">
          {m("writeAuthCode")}
        </p>
      )}

      <div className="flex flex-col">
        <label>{m("authCode")}</label>
        <input
          type="text"
          className={`border border-gray-400 rounded p-2 mt-3 ${
            (errors.authCode || isAuthError) && "border-red-400"
          }`}
          {...register("authCode", {
            required: m("writeAuthCode"),
          })}
        />
        {errors.authCode && (
          <span className="text-sm text-red-400 mt-2">
            {errors.authCode.message}
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
            maxLength: {
              value: 6,
              message: m("maxLength"),
            },
          })}
        />
        {errors.name && (
          <span className="text-sm text-red-400 mt-2">
            {errors.name.message}
          </span>
        )}
      </div>

      <div className="flex flex-col">
        <div className="flex gap-2">
          <input
            type="checkbox"
            id="over_age"
            className="focus:outline-none"
            {...register("isOverAge", {
              required: m("needAgree"),
            })}
          />
          <label htmlFor="over_age">{m("isOverAge")}</label>
        </div>
        {errors.isOverAge && (
          <span className="text-sm text-red-400 mt-2">
            {errors.isOverAge.message}
          </span>
        )}
      </div>

      {isAuthError && (
        <p className="text-sm text-red-400 text-center">{m("wrongAuthCode")}</p>
      )}

      <div>
        <p className="text-sm text-gray-800 mb-2">
          {m.rich("isAgree", {
            span: (chunks) => (
              <Link
                href={
                  "https://parallel-jodhpur-935.notion.site/10d2c71ec7c580359d04cd5af3006252"
                }
                className="underline font-bold"
                target="_blank"
              >
                {chunks}
              </Link>
            ),
          })}
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
