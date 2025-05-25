import type React from "react"
import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "HashMatrix - Solo Mining Pools",
  description: "HashMatrix Solo Mining Pools - Professional cryptocurrency mining dashboard",
  keywords: "mining, cryptocurrency, bitcoin, pool, hashrate, blockchain",
  authors: [{ name: "HashMatrix" }],
  robots: "index, follow",
  viewport: "width=device-width, initial-scale=1",
    generator: 'v0.dev'
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
        <meta name="theme-color" content="#ffc107" />
      </head>
      <body>{children}</body>
    </html>
  )
}
