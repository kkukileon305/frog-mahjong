import { getCookie } from "cookies-next";
import { cookies } from "next/headers";
import Link from "next/link";
import Header from "@/app/Header";
import { getTranslations } from "next-intl/server";

const Home = async () => {
  const refreshToken = getCookie("refreshToken", {
    cookies,
  });

  const m = await getTranslations("MainPage");

  return (
    <>
      <Header />
      {refreshToken ? (
        <div className="min-h-[calc(100dvh-64px)] flex flex-col justify-center items-center gap-4">
          <Link href="/rooms">{m("searchRooms")}</Link>
        </div>
      ) : (
        <div className="min-h-[calc(100dvh-64px)] flex justify-center items-center gap-4">
          <Link href="/signin">{m("signIn")}</Link>
          <Link href="/signup">{m("signUp")}</Link>
        </div>
      )}
    </>
  );
};

export default Home;
