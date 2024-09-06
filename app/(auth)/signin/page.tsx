import SignInForm from "@/app/(auth)/signin/SignInForm";
import Link from "next/link";
import GoogleSignInBtn from "@/app/(auth)/GoogleSignInBtn";
import { getTranslations } from "next-intl/server";

const Page = async () => {
  const m = await getTranslations("SignIn");

  return (
    <div className="bg-slate-50 min-h-[100dvh]">
      <div className="max-w-[358px] mx-auto py-24 px-2">
        <h2 className="font-bold text-2xl text-center mb-6">{m("title")}</h2>

        <SignInForm />

        <div className="flex relative my-8">
          <div className="w-full h-[1px] bg-gray-400" />
          <p className="absolute left-[calc(50%-20px)] top-[calc(50%-16px)] bg-slate-50 px-2">
            {m("or")}
          </p>
        </div>

        <GoogleSignInBtn />

        <div className="flex flex-col items-center gap-4 justify-center mt-4">
          <Link href="/signup" className="text-blue-400">
            {m("noAccount")}
          </Link>

          <Link href="/" className="text-blue-400">
            {m("back")}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Page;
