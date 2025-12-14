import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import { Toaster } from "@/components/ui/sonner";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Evently",
  description: "A Platform for University Event's Management",
  icons: {
    icon: "app/favicon.ico",
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
        className={`${poppins.variable}  antialiased bg-gray-50 min-h-screen`}
      >
        <div className="flex h-screen flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <Toaster />
          <Footer />
        </div>
      </body>
    </html>
  );
}
