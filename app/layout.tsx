import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { NetworkWarning } from "@/components/NetworkWarning";

export const metadata: Metadata = {
  title: "EELP | Crypto Market Intelligence & On-Chain Forensics",
  description: "Turn raw blockchain activity into understandable market intelligence. Crypto X-Ray, Wallet Graph, Flow Divergence, and Behavioral Fingerprints.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#080c14] text-slate-900 dark:text-slate-100 font-sans antialiased selection:bg-emerald-500/20 selection:text-emerald-400">
        <Providers>
          <NetworkWarning />
          <Navbar />
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
