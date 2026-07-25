import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";
import { SiteFooter, SiteHeader } from "./site-chrome";

const inter = Inter({ subsets: ["latin", "latin-ext"], variable: "--font-body" });
const manrope = Manrope({ subsets: ["latin", "latin-ext"], variable: "--font-display" });

export const metadata: Metadata = {
  metadataBase: new URL("https://zevsflow.sk"),
  title: "ZevsFlow — súkromný náhľad",
  description: "Kontrolovaná AI automatizácia pre konkrétne firemné procesy.",
  applicationName: "ZevsFlow",
  robots: { index: false, follow: false },
  other: { "codex-preview": "development" },
  icons: { icon: "/favicon.svg" },
  alternates: { canonical: "/" },
  openGraph: {
    title: "ZevsFlow — súkromný náhľad",
    description: "Kontrolovaná AI automatizácia pre konkrétne firemné procesy.",
    url: "https://zevsflow.sk",
    siteName: "ZevsFlow",
    locale: "sk_SK",
    type: "website",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "ZevsFlow — kontrolovaná AI automatizácia",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ZevsFlow — súkromný náhľad",
    description: "Kontrolovaná AI automatizácia pre konkrétne firemné procesy.",
    images: ["/opengraph-image.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="sk" className={`${inter.variable} ${manrope.variable}`}><body><SiteHeader />{children}<SiteFooter /></body></html>;
}
