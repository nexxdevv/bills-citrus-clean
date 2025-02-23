import type { Metadata } from "next"
import "./globals.css"
import Header from "@/components/Header"
import { AuthProvider } from "@/context/AuthContext"
import { CartProvider } from "@/context/CartContext"

export const metadata: Metadata = {
  title: "Bill's Citrus Clean"
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="dark:bg-darkMode">
        <AuthProvider>
          <CartProvider>
            <Header />
            {children}
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
