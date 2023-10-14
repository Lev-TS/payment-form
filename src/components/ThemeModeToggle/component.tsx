"use client";

import * as React from "react";
import { useTheme } from "next-themes";

import { MoonIcon, SunIcon, LaptopIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { RootLayoutDict } from "@/app/[lang]/types";

export const ThemeModeToggle = ({ dict }: { dict: RootLayoutDict }) => {
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">{dict.toggleTheme}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="mx-3">
        <DropdownMenuItem className="gap-3 py-2" onClick={() => setTheme("light")}>
          <SunIcon />
          <div>{dict.light}</div>
        </DropdownMenuItem>
        <Separator />
        <DropdownMenuItem className="gap-3 py-2" onClick={() => setTheme("dark")}>
          <MoonIcon />
          <div>{dict.dark}</div>
        </DropdownMenuItem>
        <Separator />
        <DropdownMenuItem className="gap-3 py-2" onClick={() => setTheme("system")}>
          <LaptopIcon />
          <div>{dict.system}</div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
