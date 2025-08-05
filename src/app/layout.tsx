import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Meu Progresso - Acompanhamento de Peso",
  description: "Aplicativo moderno para acompanhar sua jornada de perda de peso com fotos, gráficos e metas personalizadas.",
  keywords: ["peso", "saúde", "fitness", "progresso", "dieta", "exercício"],
  authors: [{ name: "Health App Team" }],
  openGraph: {
    title: "Meu Progresso - Acompanhamento de Peso",
    description: "Acompanhe sua jornada de saúde com facilidade",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Meu Progresso",
    description: "Acompanhe sua jornada de saúde com facilidade",
  },
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#3b82f6" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Meu Progresso" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground overflow-x-hidden`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
