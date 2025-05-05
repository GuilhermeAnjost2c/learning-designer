
"use client"

import { useEffect, useState } from "react"
import { useTheme as useNextTheme } from "next-themes"

export function useTheme() {
  const { theme, setTheme } = useNextTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  // Returns theme only when component is mounted to avoid hydration mismatch
  return {
    theme: mounted ? theme : undefined,
    setTheme,
    toggleTheme,
  }
}
