import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getCookie, hasCookie } from "cookies-next";
import { cookies } from "next/headers";

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const isSignIn = hasCookie("refreshToken", {
    cookies,
  });

  const pathname = request.nextUrl.pathname;

  // if isSignIn is true and access authentic page, redirect to main
  if (isSignIn && !pathname.includes("rooms")) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (!isSignIn && pathname.includes("rooms")) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    "/signin",
    "/signup/:path*",
    "/forgot-password",
    "/reset-password/:path*",
    "/rooms/:path*",
  ],
};
