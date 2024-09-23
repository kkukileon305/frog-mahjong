"use client";

import { useLocale, useTranslations } from "next-intl";
import { setCookie } from "cookies-next";
import { JP, KR, LOCALE_COOKIE_NAME, US } from "@/utils/constants/const";
import { useRouter } from "next/navigation";
import { IoLanguage } from "react-icons/io5";
import { FaCheck } from "react-icons/fa";

const locales = [KR, JP];

const SwitchLocale = () => {
  const m = useTranslations("Locale");
  const locale = useLocale();
  const router = useRouter();

  const onClick = (localeName: string) => {
    setCookie(LOCALE_COOKIE_NAME, localeName);
    router.refresh();
  };

  return (
    <div className="relative group" tabIndex={0}>
      <div className="cursor-pointer hover:bg-gray-200 group-focus:bg-gray-200 p-2 rounded-xl">
        <IoLanguage size={24} />
      </div>
      <div className="absolute top-[calc(100%+4px)] right-0 invisible group-focus:visible flex flex-col border rounded-xl overflow-hidden drop-shadow-lg">
        {locales.map((localeName) => (
          <div
            onClick={() => onClick(localeName)}
            className="w-32 p-2 border-b last:border-none bg-white hover:bg-gray-200 cursor-pointer"
            key={localeName}
          >
            <p
              className={`flex gap-2 items-center ${
                locale === localeName && "text-blue-400"
              }`}
            >
              {m(localeName)}({localeName.toUpperCase()})
              {locale === localeName && <FaCheck />}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SwitchLocale;
