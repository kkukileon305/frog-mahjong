import { getCookie, hasCookie } from "cookies-next";
import { cookies } from "next/headers";
import Link from "next/link";

const Home = () => {
  const isLogin = hasCookie("access-token", {
    cookies,
  });

  if (isLogin) {
    return <></>;
  }

  return (
    <div className="min-h-[calc(100vh-64px)] flex justify-center items-center gap-4">
      <Link href="/signin">로그인</Link>
      <Link href="/signup">회원가입</Link>
    </div>
  );
};

export default Home;
