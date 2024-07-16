import { getCookie, hasCookie } from "cookies-next";
import { cookies } from "next/headers";
import Link from "next/link";

const Home = () => {
  const refreshToken = getCookie("refreshToken", {
    cookies,
  });

  if (refreshToken) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex justify-center items-center gap-4">
        <Link href="/rooms">방 살펴보기</Link>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] flex justify-center items-center gap-4">
      <Link href="/signin">로그인</Link>
      <Link href="/signup">회원가입</Link>
    </div>
  );
};

export default Home;
