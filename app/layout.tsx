import type { Metadata } from "next"
import "./globals.css"
import Header from "@/components/Header"
import { AuthProvider } from "@/context/AuthContext"
import { CartProvider } from "@/context/CartContext"
import Footer from "@/components/Footer"

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
      <body className="dark:bg-darkMode bg-lightMode bg-[repeating-linear-gradient(-45deg,#99999949_1px,#3c5c4426_1px,transparent_2px,transparent_18px)] mt-20">
        <AuthProvider>
          <CartProvider>
            <Header />
            {children}
            <Footer />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
