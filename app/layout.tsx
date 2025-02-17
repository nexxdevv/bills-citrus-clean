import type { Metadata } from "next"
import "./globals.css"
import Header from "@/components/Header"
import { AuthProvider } from "@/context/AuthContext"

export const metadata: Metadata = {
  title: "Bill's Citrus Clean",
  description: "Generated by create next app"
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Header />
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
