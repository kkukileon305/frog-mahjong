import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/signup",
        "/signup/done",
        "/signin",
        "/callback/google",
        "/forgot-password",
        "/reset-password",
        "/reset-password/done",
        "/rooms",
      ],
    },
  };
}
// a 태그가 있는것만 봇이 추적해서 스캔?
