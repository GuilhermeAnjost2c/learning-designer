
import { useContext } from "react";

// Define the ThemeProviderContext type
interface ThemeContextType {
  theme: string | undefined;
  setTheme: (theme: string) => void;
}

// Create a simple implementation of useTheme that works with next-themes
export const useTheme = () => {
  // Access theme from localStorage or default to system theme
  const getTheme = () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") || "light";
    }
    return "light";
  };
  
  // Set theme in localStorage and document
  const setTheme = (theme: string) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("theme", theme);
      
      // Apply theme to document
      const root = window.document.documentElement;
      const isDark = theme === "dark";
      
      root.classList.remove(isDark ? "light" : "dark");
      root.classList.add(theme);
    }
  };
  
  return {
    theme: getTheme(),
    setTheme,
    toggleTheme: () => {
      const current = getTheme();
      setTheme(current === "dark" ? "light" : "dark");
    },
  };
};
