import type { Metadata, Viewport } from "next";
import { Playfair_Display, DM_Sans } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-playfair",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-dm-sans",
});

export const metadata: Metadata = {
  title: {
    default: "Nguyen's Recipes",
    template: "%s | Nguyen's Recipes",
  },
  description:
    "Your personal recipe collection. Save, organize, and discover new recipes.",
  keywords: ["recipes", "cooking", "food", "meal planning", "cookbook"],
  authors: [{ name: "Nguyen" }],
  creator: "Nguyen",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  ),
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Nguyen's Recipes",
    title: "Nguyen's Recipes",
    description:
      "Your personal recipe collection. Save, organize, and discover new recipes.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nguyen's Recipes",
    description:
      "Your personal recipe collection. Save, organize, and discover new recipes.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fefcf9" },
    { media: "(prefers-color-scheme: dark)", color: "#1c1917" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${dmSans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
