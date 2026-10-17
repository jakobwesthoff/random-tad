import type React from "react"
import "./globals.css"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import { ThemeProvider } from "next-themes"

// font
const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  // Base for the absolute URLs that link previews need.
  metadataBase: new URL("https://random-tad.de"),
  title: "Random TAD - Trek am Dienstag Randomizer",
  description: "Discover random episodes from your favorite Star Trek podcast",
  openGraph: {
    type: "website",
    url: "/",
    title: "Random TAD",
    description: "A random episode of Trek am Dienstag, one press away.",
    images: [
      {
        url: "/og.png",
        width: 1280,
        height: 640,
        type: "image/png",
        alt: "Random TAD: a random episode of Trek am Dienstag, one press away. A glowing random button on a starfield.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: [{ url: "/og.png", alt: "Random TAD: a random episode of Trek am Dienstag, one press away. A glowing random button on a starfield." }],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "RandomTAD",
    startupImage: ["/apple-icon.png"],
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icon.png' },
      { url: '/icon.svg' },
    ],
    apple: [
      { url: '/apple-icon.png' },
    ],
  },
}

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
