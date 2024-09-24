"use client";

import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import axiosInstance, { ReportMetadata } from "@/utils/axios";
import { useTranslations } from "next-intl";
import { SubmitHandler, useForm } from "react-hook-form";
import { getCookie } from "cookies-next";

type ReportModalProps = {
  targetUserID: number;
  setReportModalOpen: Dispatch<SetStateAction<boolean>>;
};

type Inputs = {
  categoryID: string;
  reason: string;
  targetUserID: number;
};

const ReportModal = ({
  targetUserID,
  setReportModalOpen,
}: ReportModalProps) => {
  const m = useTranslations("Report");

  const accessToken = getCookie("accessToken") as string;
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    getValues,
  } = useForm<Inputs>({
    defaultValues: {
      targetUserID,
    },
  });
  const [reportData, setReportData] = useState<ReportMetadata | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axiosInstance.get<ReportMetadata>(
          "/v0.1/game/report/meta"
        );
        setReportData(data);
      } catch (e) {
        console.log(e);
      }
    })();
  }, []);

  const onSubmit: SubmitHandler<Inputs> = async (inputs) => {
    setIsLoading(true);
    try {
      await axiosInstance.post(
        "/v0.1/game/report",
        {
          categoryID: Number(inputs.categoryID),
          reason: inputs.reason,
          targetUserID,
        },
        {
          headers: {
            tkn: accessToken,
          },
        }
      );

      setReportModalOpen(false);
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  watch((inputs) => {
    if (reportData === null) return;

    if (Number(inputs.categoryID) !== 4) {
      const reason = reportData.categories.find(
        (d) => d.id.toString() === inputs.categoryID
      )!.reason;

      if (getValues("reason") !== reason) {
        setValue("reason", reason);
      }
    }
  });

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full flex flex-col gap-8 my-8"
    >
      <div className="flex flex-col">
        <label className="text-center text-3xl font-bold">{m("title")}</label>
        <div className="flex justify-between flex-col gap-2 mt-3">
          {!reportData && <div>{m("loading")}</div>}

          {reportData?.categories.map((d) => (
            <label
              key={d.id}
              className={`w-full text-xl flex font-bold justify-center cursor-pointer py-2 ${
                watch("categoryID") === d.id.toString()
                  ? "bg-button-selected text-white"
                  : "bg-white text-green-600"
              }`}
            >
              <input
                type="radio"
                value={d.id}
                {...register("categoryID", {
                  required: m("selectMeta"),
                })}
                hidden
              />
              {d.reason}
            </label>
          ))}
        </div>

        {errors.categoryID && (
          <span className="text-red-400 mt-2 text-center">
            {errors.categoryID.message}
          </span>
        )}
      </div>

      {watch("categoryID") === "4" && (
        <div className="flex flex-col">
          <label>{m("reason")}</label>
          <input
            type="text"
            className={`border border-gray-400 rounded p-2 mt-3 ${
              errors.reason && "border-red-400"
            }`}
            {...register("reason", {
              required: m("writeReason"),
            })}
          />
          {errors.reason && (
            <span className="text-sm text-red-400 mt-2">
              {errors.reason.message}
            </span>
          )}
        </div>
      )}

      <div className="flex gap-2">
        <button
          id="back"
          type="button"
          className="w-full bg-sky-500 rounded-lg py-3 text-white font-bold disabled:bg-gray-400"
        >
          {m("close")}
        </button>

        <button
          disabled={isLoading}
          className="w-full bg-yellow-button rounded-lg py-3 text-white font-bold disabled:bg-gray-400"
        >
          {m("send")}
        </button>
      </div>
    </form>
  );
};

export default ReportModal;
