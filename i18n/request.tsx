import { getRequestConfig } from "next-intl/server";
import { getCookie } from "cookies-next";
import { KR, LOCALE_COOKIE_NAME } from "@/utils/constants/const";
import { cookies } from "next/headers";

export default getRequestConfig(async () => {
  const locale =
    getCookie(LOCALE_COOKIE_NAME, {
      cookies,
    })?.toString() || KR;

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
