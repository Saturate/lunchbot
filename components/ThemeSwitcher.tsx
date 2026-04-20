"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import styles from "./ThemeSwitcher.module.css";

type Theme = "light" | "dark" | "system";

export default function ThemeSwitcher() {
  const [theme, setTheme] = useState<Theme>("system");
  const [mounted, setMounted] = useState(false);

  const applyTheme = useCallback((newTheme: Theme) => {
    const html = document.querySelector("html");
    if (!html) return;

    if (newTheme === "system") {
      const systemPrefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)",
      ).matches;
      html.classList.remove("light", "dark");
      html.classList.add(systemPrefersDark ? "dark" : "light");
      localStorage.setItem("theme", "system");
    } else {
      html.classList.remove("light", "dark");
      html.classList.add(newTheme);
      localStorage.setItem("theme", newTheme);
    }
  }, []);

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme") as Theme | null;
    const initialTheme = storedTheme || "system";

    setTheme(initialTheme);
    applyTheme(initialTheme);
    setMounted(true);

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      if (theme === "system") {
        applyTheme("system");
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme, applyTheme]);

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
    applyTheme(newTheme);
  };

  return (
    <div className={styles.switcherWrapper}>
      <div
        className={styles.switcher}
        role="radiogroup"
        aria-label="Theme selection"
      >
        <button
          type="button"
          className={`${styles.themeButton} ${theme === "light" ? styles.active : ""}`}
          onClick={() => handleThemeChange("light")}
          disabled={!mounted}
          aria-label="Light theme"
          role="radio"
          aria-checked={theme === "light"}
        >
          <Sun size={18} />
        </button>
        <button
          type="button"
          className={`${styles.themeButton} ${theme === "system" ? styles.active : ""}`}
          onClick={() => handleThemeChange("system")}
          disabled={!mounted}
          aria-label="System theme"
          role="radio"
          aria-checked={theme === "system"}
        >
          <Monitor size={18} />
        </button>
        <button
          type="button"
          className={`${styles.themeButton} ${theme === "dark" ? styles.active : ""}`}
          onClick={() => handleThemeChange("dark")}
          disabled={!mounted}
          aria-label="Dark theme"
          role="radio"
          aria-checked={theme === "dark"}
        >
          <Moon size={18} />
        </button>
      </div>
    </div>
  );
}
