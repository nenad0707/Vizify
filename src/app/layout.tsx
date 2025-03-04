import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { Providers } from "@/components/Providers";
import Footer from "@/components/Footer";
import { CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Vizify | Digital Business Cards",
  description: "Create and share modern digital business cards",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Define icons for different toast types
  const toastIcons = {
    success: <CheckCircle className="h-4 w-4" />,
    error: <AlertCircle className="h-4 w-4" />,
    info: <Info className="h-4 w-4" />,
    warning: <AlertTriangle className="h-4 w-4" />,
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} antialiased flex flex-col min-h-screen`}
      >
        <Providers>
          <div className="relative flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1 pt-16 relative z-10">{children}</main>
            <Footer />
          </div>
          <Toaster richColors position="top-right" icons={toastIcons} />
        </Providers>
      </body>
    </html>
  );
}
