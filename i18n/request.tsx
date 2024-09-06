import { getRequestConfig } from "next-intl/server";
import { getCookie } from "cookies-next";
import { KR } from "@/utils/const";

const LOCALE_COOKIE_NAME = "LOCALE_NAME";

export default getRequestConfig(async () => {
  const locale = getCookie(LOCALE_COOKIE_NAME)?.toString() || KR;

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
