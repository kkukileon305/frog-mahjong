import React from "react";
import Link from "next/link";

const Header = () => {
  return (
    <header className="h-16 border-b">
      <div className="h-full max-w-[800px] mx-auto flex items-center">
        <Link href="/" className="font-bold text-2xl">
          메인
        </Link>
      </div>
    </header>
  );
};

export default Header;
