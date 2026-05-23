import type { Metadata, Viewport } from "next";
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

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Estrellas",
    template: "%s | Estrellas",
  },
  description:
    "Escribe un pensamiento, elige tu país y colócalo como una estrella en un cielo compartido. Explora mensajes de otras personas en un mapa espacial interactivo.",
  keywords: [
    "estrellas",
    "pensamientos",
    "mensajes anónimos",
    "cielo nocturno",
    "mapa interactivo",
    "universo",
    "nebulosa",
  ],
  applicationName: "Estrellas",
  authors: [{ name: "Estrellas" }],
  creator: "Estrellas",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: "/",
    siteName: "Estrellas",
    title: "Estrellas",
    description:
      "Escribe un pensamiento y colócalo como una estrella. Explora un cielo compartido lleno de mensajes de todo el mundo.",
    images: [
      {
        url: "/fondo-espacio.jpg",
        width: 1200,
        height: 630,
        alt: "Cielo estrellado con nebulosa — Estrellas",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Estrellas",
    description:
      "Escribe un pensamiento y colócalo como una estrella en un cielo compartido.",
    images: ["/fondo-espacio.jpg"],
  },
  alternates: {
    canonical: "/",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#050b16",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-dvh flex flex-col">{children}</body>
    </html>
  );
}
