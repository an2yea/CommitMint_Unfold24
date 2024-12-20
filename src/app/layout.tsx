import localFont from "next/font/local";
import { Inter } from 'next/font/google'
import { ThemeProvider } from "@/components/theme-provider"
import "../styles/globals.css";
import React from 'react';
import { DashboardProvider } from '@/context/DashboardContext';

const inter = Inter({ subsets: ['latin'] })
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "CommitMint",
  description: "Commit to your habits, mint NFTs along the way!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <DashboardProvider>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          {children}
        </ThemeProvider>
        </DashboardProvider>
      </body>
    </html>
  );
}