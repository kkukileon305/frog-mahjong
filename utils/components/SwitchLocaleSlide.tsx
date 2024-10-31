"use client";

import { useLocale, useTranslations } from "next-intl";
import { setCookie } from "cookies-next";
import { JP, KR, LOCALE_COOKIE_NAME, US } from "@/utils/constants/const";
import { useRouter } from "next/navigation";
import { IoLanguage } from "react-icons/io5";
import { FaCheck } from "react-icons/fa";

const locales = [KR, JP];

const SwitchLocaleSlide = () => {
  const m = useTranslations("Locale");
  const locale = useLocale();
  const router = useRouter();

  const onClick = (localeName: string) => {
    setCookie(LOCALE_COOKIE_NAME, localeName);
    router.refresh();
  };

  return (
    <div
      className="relative flex gap-4 items-center justify-between"
      tabIndex={0}
    >
      <div className="p-2 landscape:p-1 rounded-xl">
        <IoLanguage size={24} />
      </div>
      <div className="flex rounded-xl">
        {locales.map((localeName) => (
          <div
            onClick={() => onClick(localeName)}
            className="w-24 p-2 border-r last:border-none bg-white hover:bg-gray-200 cursor-pointer"
            key={localeName}
          >
            <p
              className={`flex gap-2 items-center text-xs justify-center ${
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

export default SwitchLocaleSlide;
