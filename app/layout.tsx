import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";
import "./pilot.css";
import { SiteFooter, SiteHeader } from "./site-chrome";
import {
  PUBLIC_INDEXING_ENABLED,
  SITE_DESCRIPTION,
  SITE_TITLE,
  SITE_URL,
} from "./site-config";

const inter = Inter({ subsets: ["latin", "latin-ext"], variable: "--font-body" });
const manrope = Manrope({ subsets: ["latin", "latin-ext"], variable: "--font-display" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  applicationName: "ZevsFlow",
  robots: {
    index: PUBLIC_INDEXING_ENABLED,
    follow: PUBLIC_INDEXING_ENABLED,
    googleBot: {
      index: PUBLIC_INDEXING_ENABLED,
      follow: PUBLIC_INDEXING_ENABLED,
    },
  },
  icons: { icon: "/favicon.svg" },
  alternates: { canonical: "/" },
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
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
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: ["/opengraph-image.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="sk" className={`${inter.variable} ${manrope.variable}`}>
      <body>
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
