import type React from "react"
import type { Metadata, Viewport } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "HashMatrix - Solo Mining Pools",
  description: "HashMatrix Solo Mining Pools - Professional cryptocurrency mining dashboard",
  keywords: "mining, cryptocurrency, bitcoin, pool, hashrate, blockchain",
  authors: [{ name: "HashMatrix" }],
  robots: "index, follow",
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffc107",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>{children}</body>
    </html>
  )
}
