import ForgotPasswordForm from "@/app/(auth)/forgot-password/ForgotPasswordForm";
import { getTranslations } from "next-intl/server";

const Page = async () => {
  const m = await getTranslations("ForgotPassword");

  return (
    <div className="min-h-dvh flex justify-center items-center px-2">
      <div className="max-w-[358px] w-full mx-auto py-24">
        <h2 className="font-bold text-2xl text-center mb-6">{m("title")}</h2>

        <ForgotPasswordForm />
      </div>
    </div>
  );
};

export default Page;
