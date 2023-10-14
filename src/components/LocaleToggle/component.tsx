"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";

import { Button } from "../ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Separator } from "../ui/separator";

import { type Locale, i18n } from "@/i18n.config";
import { useLang } from "@/hooks/useLang";

export const LocaleToggle = () => {
  const lang = useLang();
  const router = useRouter();
  const pathName = usePathname();
  const [currentLocale, setCurrentLocale] = React.useState(lang);

  const redirectedPathName = (locale: string) => {
    if (!pathName) return "/";
    const segments = pathName.split("/");
    segments[1] = locale;
    return segments.join("/");
  };

  const getClickHandler = (locale: Locale) => () => {
    setCurrentLocale(locale);
    router.replace(redirectedPathName(locale));
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <span>{currentLocale.toLocaleUpperCase()}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="mx-3">
        {i18n.locales.map((locale, idx, arr) => {
          return (
            <div key={idx}>
              <DropdownMenuItem className="gap-3 py-2" onClick={getClickHandler(locale)} key={locale}>
                <span>{i18n.supportedLang[locale]}</span>
              </DropdownMenuItem>
              {idx !== arr.length - 1 ? <Separator /> : null}
            </div>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
