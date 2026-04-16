import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import { TopTabBar } from "@/components/top-tab-bar";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "CollectIQ | Backd Payments",
  description:
    "AI-Powered Collections & Risk Intelligence for B2B Net Terms",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.className}>
      <body style={{ background: '#0e0e0e' }}>
        <TooltipProvider>
          <TopTabBar />
          <main className="mx-auto max-w-[1280px]" style={{ padding: '80px 80px 100px' }}>
            {children}
          </main>
        </TooltipProvider>
      </body>
    </html>
  );
}
