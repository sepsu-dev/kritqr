import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "@/app/globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://kritqr.my.id"),
  title: {
    default: "KritQR — Generate QR Code Online Gratis",
    template: "%s | KritQR",
  },
  description:
    "Tool sederhana untuk generate QR code dari teks secara instan. Gratis, cepat, dan mudah digunakan. Buat QR code tanpa daftar.",
  keywords: [
    "QR Code Generator",
    "Generate QR Code",
    "QR Code Online",
    "KritQR",
    "QR Code Gratis",
    "Buat QR Code",
    "QR Generator Indonesia",
  ],
  applicationName: "KritQR",
  authors: [{ name: "KritQR" }],
  creator: "KritQR",
  publisher: "KritQR",
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "/",
    siteName: "KritQR",
    title: "KritQR — Generate QR Code Online Gratis",
    description:
      "Tool sederhana untuk generate QR code dari teks secara instan. Gratis, cepat, dan mudah digunakan.",
  },
  twitter: {
    card: "summary_large_image",
    title: "KritQR — Generate QR Code Online Gratis",
    description:
      "Tool sederhana untuk generate QR code dari teks secara instan. Gratis, cepat, dan mudah digunakan.",
  },
  robots: {
    index: true,
    follow: true,
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: "KritQR",
              url: "https://kritqr.my.id",
              applicationCategory: "UtilitiesApplication",
              operatingSystem: "Web",
              description:
                "Tool sederhana untuk generate QR code dari teks secara instan. Gratis, cepat, dan mudah digunakan.",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "IDR",
              },
            }),
          }}
        />
        {children}
      </body>
    </html>
  );
}