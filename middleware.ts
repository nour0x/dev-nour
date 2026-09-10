import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "./src/i18n/routing";
import { COOKIE_NAME, verifySessionToken } from "./src/lib/auth-edge";
import { SECURITY_HEADERS } from "./src/lib/security";

const intlMiddleware = createMiddleware(routing);

function withSecurity(response: NextResponse) {
  for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
    response.headers.set(key, value);
  }
  return response;
}

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin")) {
    const isLogin = pathname === "/admin/login";
    const token = request.cookies.get(COOKIE_NAME)?.value;
    const session = token ? await verifySessionToken(token) : null;

    if (!session && !isLogin) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      return withSecurity(NextResponse.redirect(url));
    }

    if (session && isLogin) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin";
      return withSecurity(NextResponse.redirect(url));
    }

    return withSecurity(NextResponse.next());
  }

  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.includes(".") ||
    pathname.startsWith("/uploads")
  ) {
    return withSecurity(NextResponse.next());
  }

  return withSecurity(intlMiddleware(request));
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
