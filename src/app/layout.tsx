import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Jiva Prodi Harvest Champions",
  description: "Join the Jiva Prodi Harvest Champions campaign and win exciting prizes!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main className="min-h-screen bg-gradient-to-b from-green-50 to-white">
          {children}
        </main>
      </body>
    </html>
  );
}
