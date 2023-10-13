import Negotiator from "negotiator";
import { NextRequest } from "next/server";

import { match } from "@formatjs/intl-localematcher";
import { i18n } from "@/i18n.config";

export const getLocale = (request: NextRequest) => {
  const negotiatorHeaders: Record<string, string> = {};

  request.headers.forEach((value, key) => {
    negotiatorHeaders[key] = value;
  });

  const languages = new Negotiator({ headers: negotiatorHeaders }).languages();

  return match(languages, i18n.locales, i18n.defaultLocale);
};

export const findLocale = (pathname: string) => {
  return i18n.locales.some((locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`);
};
