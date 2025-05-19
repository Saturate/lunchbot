import clsx from "clsx";
import styles from "./layout.module.css";
import { Analytics } from "@vercel/analytics/next";
import { Jersey_25 } from "next/font/google";

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
      <head></head>
      <body className={styles.body}>{children}</body>
      <Analytics />
    </html>
  );
}
