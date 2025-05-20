"use client";

import styles from "./ThemeSwitcher.module.css";
import { Sun, Moon } from "lucide-react";

export default function ThemeSwitcher() {
  const defaultCheck =
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-color-scheme: dark)").matches
      : false;

  return (
    <div className={styles.switcher}>
      <input
        type="checkbox"
        defaultChecked={defaultCheck}
        className={styles.checkbox}
        id="checkbox"
        onClick={() => {
          if (document) {
            document.querySelector("html").classList.toggle("light");
          }
        }}
      />
      <label htmlFor="checkbox" className={styles["checkbox-label"]}>
        <Moon size={18} className={styles.moon} />
        <Sun size={18} className={styles.sun} />
        <span className={styles.ball}></span>
      </label>
    </div>
  );
}
