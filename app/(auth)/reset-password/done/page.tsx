import Link from "next/link";
import { getTranslations } from "next-intl/server";

const Page = async () => {
  const m = await getTranslations("ResetPassword");

  return (
    <div className="min-h-dvh flex justify-center items-center px-2">
      <div className="max-w-xl mx-auto py-24">
        <h2 className="text-4xl text-center mb-6">
          {m("successResetPassword")}
        </h2>

        <div className="flex justify-center">
          <Link
            href="/signin"
            className="border p-3 rounded border-blue-400 text-blue-400"
          >
            {m("reSignIn")}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Page;
