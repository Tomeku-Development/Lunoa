import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Lunoa - The Operating System for Culture | Web3 Discovery & Commerce Platform",
  description:
    "Discover, mint, and earn with Lunoa - the decentralized platform bridging digital and physical worlds through user-curated real-world experiences. Built on Aptos blockchain with SocialFi, GameFi, and DeFi integration.",
  keywords:
    "Web3, blockchain, culture, discovery, NFT, Aptos, SocialFi, GameFi, DeFi, real-world assets, decentralized commerce",
  authors: [{ name: "Lunoa Team" }],
  creator: "Lunoa",
  publisher: "Lunoa",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://lunoa.io"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Lunoa - The Operating System for Culture",
    description:
      "Discover, mint, and earn with Lunoa - the decentralized platform bridging digital and physical worlds through user-curated real-world experiences.",
    url: "https://lunoa.io",
    siteName: "Lunoa",
    images: [
      {
        url: "/Lunoa-SEO-Image.png",
        width: 1200,
        height: 630,
        alt: "Lunoa - Web3 Discovery Platform",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lunoa - The Operating System for Culture",
    description:
      "Discover, mint, and earn with Lunoa - the decentralized platform bridging digital and physical worlds.",
    images: ["/Lunoa-SEO-Image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans:ital,wght@0,100..900;1,100..900&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#000000" />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
