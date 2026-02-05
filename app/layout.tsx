import CursorHearts from "@/components/CursorHearts";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Little Blush - Will You Be My Valentine? 💝",
  description: "The cutest interactive way to ask your special someone to be your Valentine. Send a personalized link and make their heart flutter! 💖✨",
  keywords: ["Valentine's Day", "Proposal", "Cute", "Interactive", "Digital Card"],
  openGraph: {
    title: "Little Blush - Will You Be My Valentine? 💝",
    description: "The cutest interactive way to ask your special someone to be your Valentine. Send a personalized link and make their heart flutter! 💖✨",
    type: "website",
    locale: "en_US",
    siteName: "Little Blush",
  },
  twitter: {
    card: "summary_large_image",
    title: "Little Blush - Will You Be My Valentine? 💝",
    description: "The cutest interactive way to ask your special someone to be your Valentine. Send a personalized link and make their heart flutter! 💖✨",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <CursorHearts />
        {children}
      </body>
    </html>
  );
}
