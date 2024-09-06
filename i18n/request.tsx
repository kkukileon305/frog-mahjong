import { getRequestConfig } from "next-intl/server";
import { getCookie } from "cookies-next";
import { KR } from "@/utils/const";

const COOKIE_NAME = "NEXT_LOCALE";

export default getRequestConfig(async () => {
  // Provide a static locale, fetch a user setting,
  // read from `cookies()`, `headers()`, etc.
  const locale = getCookie(COOKIE_NAME)?.toString() || KR;

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
