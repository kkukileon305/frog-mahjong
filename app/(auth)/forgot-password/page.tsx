import Link from "next/link";
import ForgotPasswordForm from "@/app/(auth)/forgot-password/ForgotPasswordForm";

const Page = () => {
  return (
    <div className="bg-slate-50">
      <div className="max-w-[358px] mx-auto py-24">
        <h2 className="font-bold text-2xl text-center mb-6">
          비밀번호를 잊으셨나요?
        </h2>

        <ForgotPasswordForm />
      </div>
    </div>
  );
};

export default Page;
