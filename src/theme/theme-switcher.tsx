"use client";

import { useTheme } from "next-themes";
import { useState, useEffect } from "react";

import { Check, ChevronRight, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const themes: string[] = [
  "zinc",
  "red",
  "rose",
  "orange",
  "green",
  "blue",
  "teal",
  "yellow",
  "violet",
];

const themeColors: Record<string, string> = {
  zinc: "bg-zinc-600",
  red: "bg-red-600",
  rose: "bg-rose-600",
  orange: "bg-orange-600",
  green: "bg-green-600",
  blue: "bg-blue-600",
  teal: "bg-teal-600",
  yellow: "bg-yellow-600",
  violet: "bg-violet-600",
};

const themeModes: string[] = ["light", "dark"];

export const ThemeSwitcher = ({
  isAppNav,
  className,
}: {
  isAppNav?: boolean;
  className?: string;
}) => {
  const { setTheme, resolvedTheme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const storedTheme = localStorage?.getItem("theme") || "zinc-dark";

    const [themeName, themeMode] = storedTheme.split("-");

    const newTheme = `${themeName}-${themeMode}`;
    if (newTheme !== resolvedTheme) {
      setTheme(newTheme);
    }
    setIsMounted(true);
  }, [setTheme, resolvedTheme]);

  function handleCustomTheme(themeName: string) {
    const themeMode = resolvedTheme?.split("-")[1] ?? "dark";
    setTheme(`${themeName}-${themeMode}`);
  }

  function handleCustomThemeMode(themeModeName: string) {
    const [theme] = resolvedTheme?.split("-") ?? ["zinc"];
    setTheme(`${theme}-${themeModeName}`);
  }

  if (!isMounted) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        asChild
        className={cn("cursor-pointer mr-2", className)}
      >
        <div className="flex items-center w-full">
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              isAppNav && "pointer-events-none",
              "cursor-pointer hover:bg-transparent",
            )}
          >
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 dark:text-white" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 dark:text-white" />
            <span className="sr-only">Toggle theme</span>
          </Button>
          {isAppNav && <p>Change Theme</p>}
          {isAppNav && (
            <ChevronRight className="!h-[1.2rem] !w-[1.2rem] !ml-auto dark:text-white" />
          )}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align={isAppNav ? "center" : "end"}
        className="p-2"
        sideOffset={10}
        side={isAppNav ? "left" : "bottom"}
      >
        <div className="flex items-center gap-1 mb-3">
          {themeModes.map((themeMode, index) => {
            return (
              <div
                key={index}
                className={cn(
                  "cursor-pointer flex-1/2 hover:bg-secondary/70 text-md py-0.5 px-1 rounded",
                  resolvedTheme?.split("-")[1] === themeMode && "bg-secondary",
                )}
                onClick={() => handleCustomThemeMode(themeMode)}
              >
                {themeMode}
              </div>
            );
          })}
        </div>
        <div className="flex justify-evenly gap-2 flex-wrap">
          {themes.map((theme, i) => {
            return (
              <button
                key={i}
                className={cn(
                  "rounded-full w-4 h-4 cursor-pointer flex items-center justify-center",
                  `${themeColors[theme]}`,
                )}
                onClick={() => handleCustomTheme(theme)}
              >
                {resolvedTheme?.split("-")[0] === theme && (
                  <Check className="w-3 h-3 text-white" />
                )}
              </button>
            );
          })}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
