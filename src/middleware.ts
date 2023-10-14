import { NextResponse, type NextRequest } from "next/server";

import { findLocale, getLocale } from "./lib/edge.utils";

const PUBLIC_FILE = /\.(.*)$/;

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (
    PUBLIC_FILE.test(pathname) ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/static") ||
    pathname.startsWith("/api")
  ) {
    return NextResponse.next();
  }
  const pathnameHasLocale = findLocale(pathname);
  if (pathnameHasLocale) {
    return;
  }
  const locale = getLocale(request);
  request.nextUrl.pathname = `/${locale}${pathname}`;
  return Response.redirect(request.nextUrl);
}
