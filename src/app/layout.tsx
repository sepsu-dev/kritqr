import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "@/app/globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
});

export const metadata: Metadata = {
  title: "KritQR — Generate QR Code Online Gratis",
  description:
    "Tool sederhana untuk generate QR code dari teks secara instan. Gratis, cepat, dan mudah digunakan.",
  keywords: [
    "QR Code Generator",
    "Generate QR Code",
    "QR Code Online",
    "KritQR",
    "QR Code Gratis",
    "Buat QR Code",
  ],
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={plusJakartaSans.variable}>
      <body className="antialiased font-sans min-h-screen bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}