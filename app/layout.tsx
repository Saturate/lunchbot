import clsx from "clsx";
import styles from "./layout.module.css";

type Props = {
  children: React.ReactNode;
  params: Promise<{ lang: "en" | "da" }>;
};

export default async function AuthorizedLayout({
  params,
  children,
}: Readonly<Props>) {
  return (
    <html>
      <head></head>
      <body className={styles.body}>{children}</body>
    </html>
  );
}
