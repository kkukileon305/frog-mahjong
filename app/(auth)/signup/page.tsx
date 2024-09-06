import SignUpForm from "@/app/(auth)/signup/SignUpForm";
import Link from "next/link";
import GoogleSignInBtn from "@/app/(auth)/GoogleSignInBtn";

const Page = () => {
  return (
    <div className="bg-slate-50 min-h-[100vh]">
      <div className="max-w-[358px] mx-auto py-24 px-2">
        <h2 className="font-bold text-2xl text-center mb-6">회원가입</h2>
        <GoogleSignInBtn />

        <div className="flex relative my-8">
          <div className="w-full h-[1px] bg-gray-400" />
          <p className="absolute left-[calc(50%-20px)] top-[calc(50%-16px)] bg-slate-50 px-2">
            또는
          </p>
        </div>

        <SignUpForm />

        <div className="flex flex-col items-center gap-4 justify-center mt-4">
          <Link href="/signin" className="text-blue-400">
            계정이 이미 있으신가요?
          </Link>

          <Link href="/" className="text-blue-400">
            돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Page;
