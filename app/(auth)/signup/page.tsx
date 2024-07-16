import SignUpForm from "@/app/(auth)/signup/SignUpForm";
import Link from "next/link";

const Page = () => {
  return (
    <div className="bg-slate-50">
      <div className="max-w-[358px] mx-auto py-24">
        <h2 className="font-bold text-2xl text-center mb-6">회원가입</h2>
        <div className="flex justify-center py-2 border border-black rounded">
          구글로 시작 버튼 추가 예정
        </div>

        <div className="flex relative my-8">
          <div className="w-full h-[1px] bg-gray-400" />
          <p className="absolute left-[calc(50%-20px)] top-[calc(50%-16px)] bg-slate-50 px-2">
            또는
          </p>
        </div>

        <SignUpForm />

        <div className="flex justify-center mt-4">
          <Link href="/signin" className="text-blue-400">
            계정이 이미 있으신가요?
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Page;
