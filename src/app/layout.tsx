import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { AppShell } from "@/components/layout/app-shell";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "OpsFlow — Business Operations Dashboard",
    template: "%s · OpsFlow",
  },
  description:
    "A simple, modern business operations dashboard for tracking orders, revenue and daily operations.",
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} antialiased`}>
      <body className="min-h-dvh">
        <AppShell>{children}</AppShell>
        <Toaster position="bottom-right" closeButton />
      </body>
    </html>
  );
}
