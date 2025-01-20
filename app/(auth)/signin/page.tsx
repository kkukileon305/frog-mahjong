import SignInForm from "@/app/(auth)/signin/SignInForm";
import Link from "next/link";
import GoogleSignInBtn from "@/app/(auth)/GoogleSignInBtn";
import { getTranslations } from "next-intl/server";

const Page = async () => {
  const m = await getTranslations("SignIn");

  return (
    <div className="max-w-[358px] mx-auto py-24 px-2">
      <h2 className="font-bold text-2xl text-center mb-6">{m("title")}</h2>

      <SignInForm />

      <div className="flex relative my-8 items-center">
        <div className="basis-2/5 h-[1px] bg-white" />
        <p className="basis-1/5 px-2 text-center">{m("or")}</p>
        <div className="basis-2/5 h-[1px] bg-white" />
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
  );
};

export default Page;
