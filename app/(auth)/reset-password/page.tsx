import ResetPasswordForm from "@/app/(auth)/reset-password/ResetPasswordForm";

const Page = () => {
  return (
    <div className="bg-slate-50">
      <div className="max-w-[358px] mx-auto py-24">
        <h2 className="font-bold text-2xl text-center mb-6">
          받은 이메일을 확인해주세요
        </h2>

        <ResetPasswordForm />
      </div>
    </div>
  );
};

export default Page;
