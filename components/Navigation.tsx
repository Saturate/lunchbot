"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { menus } from "../app/getMenu";
import styles from "./Navigation.module.css";

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav className={styles.nav} aria-label="Main navigation">
      {Object.entries(menus).map(([id, { name }]) => {
        const isActive = pathname.startsWith(`/${id}`);

        return (
          <Link
            className={styles.link}
            key={id}
            href={`/${id}`}
            aria-current={isActive ? "page" : undefined}
          >
            {name}
          </Link>
        );
      })}
    </nav>
  );
}
