import Link from "next/link";
import { getTranslations } from "next-intl/server";

const Page = async () => {
  const m = await getTranslations("SignUp");

  return (
    <div className="min-h-dvh flex justify-center items-center">
      <div className="max-w-xl mx-auto py-24">
        <h2 className="text-4xl text-center mb-6">{m("successSignUp")}</h2>

        <div className="flex justify-center">
          <Link
            href="/signin"
            className="border p-3 rounded border-blue-400 text-blue-400"
          >
            {m("signIn")}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Page;
