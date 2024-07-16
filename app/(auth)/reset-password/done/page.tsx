import Link from "next/link";

const Page = () => {
  return (
    <div className="bg-slate-50">
      <div className="max-w-xl mx-auto py-24">
        <h2 className="text-4xl text-center mb-6">
          비밀번호가 재설정되었습니다.
        </h2>

        <div className="flex justify-center">
          <Link
            href="/signin"
            className="border p-3 rounded border-blue-400 text-blue-400"
          >
            다시 로그인
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Page;
