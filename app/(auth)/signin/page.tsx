import SignInForm from "@/app/(auth)/signin/SignInForm";
import Link from "next/link";
import GoogleSignInBtn from "@/app/(auth)/GoogleSignInBtn";

const Page = () => {
  return (
    <div className="bg-slate-50 min-h-[100vh]">
      <div className="max-w-[358px] mx-auto py-24">
        <h2 className="font-bold text-2xl text-center mb-6">로그인</h2>

        <SignInForm />

        <div className="flex relative my-8">
          <div className="w-full h-[1px] bg-gray-400" />
          <p className="absolute left-[calc(50%-20px)] top-[calc(50%-16px)] bg-slate-50 px-2">
            또는
          </p>
        </div>

        <GoogleSignInBtn />

        <div className="flex justify-center mt-4">
          <Link href="/signup" className="text-blue-400">
            계정이 없으신가요?
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Page;
