import SwitchLocale from "@/utils/components/SwitchLocale";
import React from "react";
import Link from "next/link";
import logo from "@/public/logos/logo.png";
import Image from "next/image";
import SettingMenus from "@/utils/components/SettingMenus";
import { getTranslations } from "next-intl/server";

const Header = async () => {
  const m = await getTranslations("Header");

  return (
    <header className="bg-white h-16 landscape:h-10 border-b px-2">
      <div className="h-full max-w-[800px] mx-auto flex items-center justify-between">
        <Link href="/rooms" className="font-bold text-2xl">
          <Image src={logo.src} alt="Logo" width={92.5} height={38} />
        </Link>

        <div className="flex items-center gap-2">
          <Link
            href="/tutorial"
            className="hover:bg-gray-200 p-2 landscape:p-1 rounded-xl"
          >
            {m("tutorial")}
          </Link>
          <SwitchLocale />
          <SettingMenus />
        </div>
      </div>
    </header>
  );
};

export default Header;
