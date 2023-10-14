import type { Locale } from "@/i18n.config";
import type { ReactNode } from "react";
import { getDictionary } from "@/lib/server.utils";

export interface RootParams {
  params: {
    lang: Locale;
  };
}

export interface RootLayoutProps extends RootParams {
  children: ReactNode;
}

export type RootLayoutDict = Awaited<ReturnType<typeof getDictionary>>["layouts"]["root"];
