"use client";

import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";

type EnterRoomInputs = {
  password: string;
};

const EnterRoomForm = ({ roomID }: { roomID: number }) => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EnterRoomInputs>();

  const onSubmit: SubmitHandler<EnterRoomInputs> = (inputs) => {
    router.push(`/rooms/${roomID}?password=${inputs.password}`);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
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
      </div>

      <div className="flex gap-4 mt-4 flex-col-reverse md:flex-row">
        <div
          className="w-full bg-white border border-gray-400 flex justify-center items-center rounded-lg py-3 font-bold cursor-pointer"
          id="back"
        >
          닫기
        </div>
        <button
          type="submit"
          className="w-full bg-sky-500 rounded-lg py-3 text-white font-bold disabled:bg-gray-400"
        >
          입장
        </button>
      </div>
    </form>
  );
};

export default EnterRoomForm;
