import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "AIS",
  description:
    "Scouting con IA para el fútbol uruguayo: análisis de partidos y talento juvenil.",
  openGraph: {
    title: "AIS",
    description:
      "Scouting con IA para el fútbol uruguayo: análisis de partidos y talento juvenil.",
    locale: "es_UY",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={inter.variable}>
      <body className="min-h-dvh bg-[#050a0e] font-sans text-ink antialiased">{children}</body>
    </html>
  );
}
