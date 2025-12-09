import styles from "./layout.module.css";
import "./global.css";
import { Analytics } from "@vercel/analytics/next";
import { Jersey_25 } from "next/font/google";
import type { Metadata, Viewport } from "next";
import ThemeSwitcher from "../components/ThemeSwitcher";
import Navigation from "../components/Navigation";

type Props = {
  children: React.ReactNode;
};

const font = Jersey_25({
  weight: "400",
  subsets: ["latin-ext"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
};

export const metadata: Metadata = {
  title: {
    default: "Meyers Menu - LunchBot",
    template: "%s | LunchBot",
  },
  description:
    "Daily lunch menu from Meyers for IMPACT A/S. View today's menu or browse the full weekly menu with Det velkendte and Den Grønne options.",
  keywords: [
    "lunch menu",
    "Meyers",
    "IMPACT",
    "daily menu",
    "canteen",
    "food",
    "lunch",
  ],
  authors: [{ name: "IMPACT A/S" }],
  creator: "IMPACT A/S",
  publisher: "IMPACT A/S",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    locale: "da_DK",
    url: "https://lunchbot.vercel.app",
    siteName: "LunchBot",
    title: "Meyers Menu - LunchBot",
    description:
      "Daily lunch menu from Meyers. View today's menu or browse the weekly options.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "LunchBot - Meyers Menu",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Meyers Menu - LunchBot",
    description: "Daily lunch menu from Meyers for IMPACT A/S",
    images: ["/og-image.png"],
  },
};

export default function Layout({ children }: Readonly<Props>) {
  return (
    <html className={font.className} lang="da">
      <head>
        <meta name="color-scheme" content="dark light" />
      </head>
      <body>
        <a href="#main-content" className={styles.skipLink}>
          Skip to main content
        </a>
        <header className={styles.header}>
          <p className={styles.name}>LunchBot</p>
          <Navigation />
          <ThemeSwitcher />
        </header>
        <div id="main-content">{children}</div>
      </body>
      <Analytics />
    </html>
  );
}
