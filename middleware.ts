import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { hasCookie } from "cookies-next";
import { cookies } from "next/headers";

// block auth page with token
export function middleware(request: NextRequest) {
  const isSignIn = hasCookie("refreshToken", {
    cookies,
  });

  const pathname = request.nextUrl.pathname;

  // if isSignIn is true and access authentic page, redirect to main
  if (isSignIn && !pathname.includes("rooms")) {
    if (pathname.includes("settings")) {
      return;
    }

    return NextResponse.redirect(new URL("/rooms", request.url));
  }

  if (
    !isSignIn &&
    (pathname.includes("rooms") || pathname.includes("settings"))
  ) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }
}

export const config = {
  matcher: [
    "/signin",
    "/signup/:path*",
    "/forgot-password",
    "/reset-password/:path*",
    "/rooms/:path*",
    "/callback/:path*",
    "/settings",
  ],
};
