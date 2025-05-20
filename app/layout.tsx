import styles from "./layout.module.css";
import "./global.css";
import { Analytics } from "@vercel/analytics/next";
import { Jersey_25 } from "next/font/google";
import ThemeSwitcher from "../components/ThemeSwitcher";
import Navigation from "../components/Navigation";

type Props = {
  children: React.ReactNode;
  params: Promise<{ lang: "en" | "da" }>;
};

const font = Jersey_25({
  weight: "400",
  subsets: ["latin-ext"],
});

export default async function Layout({ params, children }: Readonly<Props>) {
  return (
    <html className={font.className}>
      <head>
        <meta name="color-scheme" content="dark light" />
      </head>
      <body>
        <header className={styles.header}>
          <p className={styles.name}>LunchBot</p>
          <Navigation />
          <ThemeSwitcher />
        </header>
        {children}
      </body>
      <Analytics />
    </html>
  );
}
