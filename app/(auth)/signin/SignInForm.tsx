"use client";

import { SubmitHandler, useForm } from "react-hook-form";
import { useState } from "react";
import Link from "next/link";
import axiosInstance, { ErrorType, TokenType } from "@/utils/axios";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { setCookie } from "cookies-next";
import { USER_NOT_FOUND } from "@/utils/constants/errTypes";
import { PASSWORD_NOT_MATCH } from "@/utils/constants/const";
import { useTranslations } from "next-intl";
import usePreloadAssets from "@/utils/hooks/usePreloadAssets";
import ProgressBar from "@/utils/components/ProgressBar";
import useNotificationStore from "@/utils/stores/useNotificationStore";

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
    watch,
  } = useForm<SignInInputs>();

  const {
    loadImages,
    isLoading: isImageLoading,
    loadedAssetCount,
    assetLength,
  } = usePreloadAssets();

  const [isSignInFailed, setIsSignInFailed] = useState(false);
  const [isDuplicated, setIsDuplicated] = useState(false);

  // 강제 로그인 중
  const [isPending, setIsPending] = useState(false);

  const { addNotification, removeNotification } = useNotificationStore();

  const [isLoading, setIsLoading] = useState(false);

  const signIn = async (inputs: SignInInputs) => {
    try {
      const {
        data: { accessToken, refreshToken, userID, isDuplicateLogin },
      } = await axiosInstance.post<TokenType>("/v0.1/auth/signin", {
        email: inputs.email,
        password: inputs.password,
      });

      if (isDuplicateLogin) {
        const id = new Date().getTime();

        addNotification({
          id,
          from: "system",
          collapseKey: "",
          messageId: String(id),
          notification: {
            title: m("anotherSignOut"),
          },
        });

        setTimeout(() => {
          removeNotification(id);
        }, 3000);
      }

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

      // await loadImages();

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

      if (error.response?.data.errType === "USER_ALREADY_EXISTED") {
        setIsSignInFailed(true);
        console.log('USER_ALREADY_EXISTED"');
      }
    }
  };

  const onSubmit: SubmitHandler<SignInInputs> = async (inputs) => {
    setIsLoading(true);

    try {
      const { data } = await axiosInstance.post<boolean>(
        "/v0.1/auth/signin/check",
        {
          email: inputs.email,
          password: inputs.password,
        }
      );

      if (data) {
        setIsDuplicated(true);
      } else {
        await signIn(inputs);
      }
    } catch (e) {
      const error = e as AxiosError<ErrorType>;

      // login failed
      if (
        error.response?.data.errType === USER_NOT_FOUND ||
        error.response?.data.errType === PASSWORD_NOT_MATCH
      ) {
        setIsSignInFailed(true);
      }

      if (error.response?.data.errType === "USER_ALREADY_EXISTED") {
        setIsSignInFailed(true);
        console.log('USER_ALREADY_EXISTED"');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const progress = Math.floor((loadedAssetCount * 100) / assetLength);

  return (
    <>
      {isDuplicated && (
        <div className="fixed top-0 left-0 w-full h-full bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white p-4 shadow-lg rounded-xl flex flex-col items-center justify-center gap-4">
            <p className="text-center">
              {m.rich("duplicate", {
                br: (chunks) => <br />,
              })}
            </p>
            <div className="flex gap-2">
              <button
                className="bg-blue-400 px-2 py-1 rounded font-bold text-white disabled:bg-gray-200"
                onClick={() => {
                  setIsPending(true);
                  signIn(watch());
                }}
                disabled={isPending}
              >
                {m("signIn")}
              </button>
              <button
                className="bg-red-400 px-2 py-1 rounded font-bold text-white disabled:bg-gray-200"
                onClick={() => setIsDuplicated(false)}
                disabled={isPending}
              >
                {m("close")}
              </button>
            </div>
          </div>
        </div>
      )}

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
          className="w-full bg-sky-500 rounded-lg py-3 px-2 text-white font-bold disabled:bg-gray-400"
          disabled={isLoading}
        >
          {isImageLoading &&
            (assetLength === 0 ? (
              m("getAsset")
            ) : (
              <ProgressBar progress={progress} />
            ))}
          {!isImageLoading && m("signIn")}
        </button>
      </form>
    </>
  );
};

export default SignInForm;
