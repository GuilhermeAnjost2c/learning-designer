
import { useContext, useEffect, useState } from "react";
import { ThemeProviderContext } from "@/components/theme-provider";

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);
  
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return {
    theme: context.theme,
    setTheme: context.setTheme,
    toggleTheme: () => {
      context.setTheme(context.theme === "dark" ? "light" : "dark");
    },
  };
};
