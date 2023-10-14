import type { Locale } from "@/i18n.config";
import type { ReactNode } from "react";

export interface RootParams {
  params: {
    lang: Locale;
  };
}

export interface RootLayoutProps extends RootParams {
  children: ReactNode;
}
