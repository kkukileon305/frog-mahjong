import SignUpForm from "@/app/(auth)/signup/SignUpForm";
import Link from "next/link";
import GoogleSignInBtn from "@/app/(auth)/GoogleSignInBtn";
import { getTranslations } from "next-intl/server";

const Page = async () => {
  const m = await getTranslations("SignUp");

  return (
    <div className="max-w-[358px] mx-auto py-24 px-2">
      <h2 className="font-bold text-2xl text-center mb-6">{m("title")}</h2>
      <GoogleSignInBtn />

      <div className="flex relative my-8 items-center">
        <div className="basis-2/5 h-[1px] bg-gray-400" />
        <p className="basis-1/5 px-2 text-center">{m("or")}</p>
        <div className="basis-2/5 h-[1px] bg-gray-400" />
      </div>

      <SignUpForm />

      <div className="flex flex-col items-center gap-4 justify-center mt-4">
        <Link href="/signin" className="text-blue-400">
          {m("haveAccountAlready")}
        </Link>

        <Link href="/" className="text-blue-400">
          {m("back")}
        </Link>
      </div>
    </div>
  );
};

export default Page;
