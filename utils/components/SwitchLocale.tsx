"use client";

import { useLocale } from "next-intl";
import { setCookie } from "cookies-next";
import { LOCALE_COOKIE_NAME } from "@/utils/constants/const";
import { useRouter } from "next/navigation";

const SwitchLocale = () => {
  const locale = useLocale();
  const router = useRouter();

  const onClick = () => {
    setCookie(LOCALE_COOKIE_NAME, "us");
    router.refresh();
  };

  return <div onClick={onClick}>Change {locale} to eng</div>;
};

export default SwitchLocale;
