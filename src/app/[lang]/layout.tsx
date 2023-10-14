import "@/styles/globals.css";

import type { Metadata } from "next";

import { LocaleToggle } from "@/components/LocaleToggle/component";
import { ThemeModeToggle } from "@/components/ThemeModeToggle/component";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { Toaster } from "@/components/ui/toaster";
import { i18n } from "@/i18n.config";

import { RootLayoutProps } from "./types";

export const metadata: Metadata = {
  title: "Payment",
  description: "Form to make payment",
};

export function generateStaticParams() {
  return i18n.locales.map((locale) => {
    return {
      lang: locale,
    };
  });
}

export default function RootLayout({ children, params }: RootLayoutProps) {
  return (
    <html lang={params.lang} suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="flex h-screen flex-col">
            <header className="sticky top-0 z-50 flex space-x-3 border-b bg-background p-3">
              <ThemeModeToggle />
              <LocaleToggle />
              <Toaster />
            </header>
            <main className="grow overflow-auto">{children}</main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
