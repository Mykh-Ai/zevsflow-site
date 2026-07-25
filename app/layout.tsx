import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";
import { SiteFooter, SiteHeader } from "./site-chrome";

const inter = Inter({ subsets: ["latin", "latin-ext"], variable: "--font-body" });
const manrope = Manrope({ subsets: ["latin", "latin-ext"], variable: "--font-display" });

export const metadata: Metadata = {
  title: "OfficeFlow — súkromný náhľad",
  description: "Kontrolovaná AI automatizácia pre konkrétne firemné procesy.",
  robots: { index: false, follow: false },
  other: { "codex-preview": "development" },
  icons: { icon: "/favicon.svg" }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="sk" className={`${inter.variable} ${manrope.variable}`}><body><SiteHeader />{children}<SiteFooter /></body></html>;
}
