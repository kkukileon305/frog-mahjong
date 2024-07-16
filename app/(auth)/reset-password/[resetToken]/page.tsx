import ResetPasswordForm from "@/app/(auth)/reset-password/[resetToken]/ResetPasswordForm";

type ResetPasswordProps = {
  params: { resetToken: string };
};

const Page = ({ params: { resetToken } }: ResetPasswordProps) => {
  return (
    <div className="bg-slate-50">
      <div className="max-w-[358px] mx-auto py-24">
        <h2 className="font-bold text-2xl text-center mb-6">
          새 비밀번호를 입력해주세요
        </h2>

        <ResetPasswordForm />
      </div>
    </div>
  );
};

export default Page;
