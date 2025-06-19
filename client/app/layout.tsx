import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/contexts/auth-context"
import { ArticlesProvider } from "@/contexts/articles-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "School Articles System",
  description: "A comprehensive system for managing school articles with role-based access control",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <ArticlesProvider>{children}</ArticlesProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
