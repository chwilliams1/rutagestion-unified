import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "RutaGestion — Plataforma unificada de transporte",
  description: "Gestion de flotas, operaciones y finanzas para PYMEs de transporte en Chile",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${geistSans.variable} scroll-smooth`}>
      <body className="min-h-screen bg-gray-50 text-gray-900 font-sans antialiased">{children}</body>
    </html>
  );
}
