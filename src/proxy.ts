import { NextResponse, type NextRequest } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

const PRIVATE_PREFIXES = ["/dashboard", "/payment/success"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = getSessionCookie(request);

  const isPrivate =
    PRIVATE_PREFIXES.some((prefix) => pathname.startsWith(prefix)) ||
    (pathname.startsWith("/equipment/") && pathname !== "/equipment");

  if (isPrivate && !sessionCookie) {
    const url = new URL("/login", request.url);
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/equipment/:path*", "/payment/success"],
};
