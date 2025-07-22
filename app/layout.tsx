// import type { Metadata } from 'next'
// import './globals.css'

// export const metadata: Metadata = {
//   title: 'GridCraft',
//   description: 'Created with v0',
//   generator: 'v0.dev',
// }

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode
// }>) {
//   return (
//     <html lang="en">
//       <body>{children}</body>
//     </html>
//   )
// }


import type React from "react"
import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "GridCraft - Advanced CSS Grid Builder",
  description:
    "Create complex CSS Grid layouts with visual editor, spanning controls, and code generation. Built with Next.js and Tailwind CSS.",
  generator: "v0.dev",
  keywords: ["CSS Grid", "Grid Generator", "Layout Builder", "CSS Tools", "Web Development"],
  authors: [{ name: "GridCraft" }],
  creator: "GridCraft",
  publisher: "GridCraft",
  robots: "index, follow",
  openGraph: {
    title: "GridCraft - Advanced CSS Grid Builder",
    description: "Create complex CSS Grid layouts with visual editor, spanning controls, and code generation.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "GridCraft - Advanced CSS Grid Builder",
    description: "Create complex CSS Grid layouts with visual editor, spanning controls, and code generation.",
  },
  icons: {
    icon: [
      {
        url: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'%3E%3Crect width='18' height='18' x='3' y='3' rx='2'/%3E%3Cpath d='M9 3v18'/%3E%3Cpath d='M15 3v18'/%3E%3Cpath d='M3 9h18'/%3E%3Cpath d='M3 15h18'/%3E%3C/svg%3E",
        type: "image/svg+xml",
      },
      {
        url: "/favicon.ico",
        sizes: "any",
      },
    ],
    apple: [
      {
        url: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'%3E%3Crect width='18' height='18' x='3' y='3' rx='2'/%3E%3Cpath d='M9 3v18'/%3E%3Cpath d='M15 3v18'/%3E%3Cpath d='M3 9h18'/%3E%3Cpath d='M3 15h18'/%3E%3C/svg%3E",
        sizes: "180x180",
      },
    ],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="icon"
          href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23ffffff' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'%3E%3Crect width='18' height='18' x='3' y='3' rx='2'/%3E%3Cpath d='M9 3v18'/%3E%3Cpath d='M15 3v18'/%3E%3Cpath d='M3 9h18'/%3E%3Cpath d='M3 15h18'/%3E%3C/svg%3E"
          type="image/svg+xml"
        />
        <link
          rel="icon"
          href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Crect width='24' height='24' fill='%23ffffff'/%3E%3Crect width='18' height='18' x='3' y='3' rx='2' fill='none' stroke='%233b82f6' strokeWidth='2'/%3E%3Cpath d='M9 3v18M15 3v18M3 9h18M3 15h18' stroke='%233b82f6' strokeWidth='2' strokeLinecap='round'/%3E%3C/svg%3E"
          type="image/svg+xml"
          media="(prefers-color-scheme: light)"
        />
        <link
          rel="icon"
          href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Crect width='24' height='24' fill='%23111827'/%3E%3Crect width='18' height='18' x='3' y='3' rx='2' fill='none' stroke='%236366f1' strokeWidth='2'/%3E%3Cpath d='M9 3v18M15 3v18M3 9h18M3 15h18' stroke='%236366f1' strokeWidth='2' strokeLinecap='round'/%3E%3C/svg%3E"
          type="image/svg+xml"
          media="(prefers-color-scheme: dark)"
        />
        <meta name="theme-color" content="#3b82f6" />
        <meta name="msapplication-TileColor" content="#3b82f6" />
      </head>
      <body>{children}</body>
    </html>
  )
}
