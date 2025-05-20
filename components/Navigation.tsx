import Link from "next/link";
import { menus } from "../app/getMenu";
import styles from "./Navigation.module.css";

export default function Navigation() {
  return (
    <nav className={styles.nav}>
      <Link className={styles.link} href={"/"}>
        Dagens
      </Link>
      {Object.entries(menus).map(([id, { contentTab }]) => {
        return (
          <Link className={styles.link} key={id} href={"/" + id}>
            {contentTab}
          </Link>
        );
      })}
    </nav>
  );
}
