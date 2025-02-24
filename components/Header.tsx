"use client"

import Link from "next/link"
import React, { useEffect, useState } from "react"
import { Pacifico, Sofia_Sans } from "next/font/google"
import { ShoppingBag, User } from "lucide-react"
import { useCart } from "@/context/CartContext"
import ThemeToggle from "./ThemeToggle"

const pacifico = Pacifico({ subsets: ["latin"], weight: "400" })
const sofia_sans = Sofia_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700", "800", "600"]
})

const Header = () => {
  const { cart } = useCart()
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0)

  const [visible, setVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  useEffect(() => {
    

    const handleScroll = () => {
      const scrollY = window.scrollY

      if (scrollY > lastScrollY + 4) {
        setVisible(false) // Hide only if scrolled down past header height
      } else if (scrollY < lastScrollY) {
        setVisible(true) // Show when scrolling up
      }

      setLastScrollY(scrollY)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [lastScrollY]) // Depend on headerHeight

  return (
    <header
      className={`fixed top-0 left-0 w-full bg-white dark:bg-darkMode shadow-md transition-transform duration-300 z-50 ${
        visible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="flex justify-between items-center max-w-6xl mx-auto p-4">
        <Link href="/" className="leading-none">
          <>
            <h1
              className={`${pacifico.className} scale-[0.85] text-2xl tracking-wide dark:text-white`}
            >
              Bill&apos;s
            </h1>
            <h1
              className={`${sofia_sans.className} text-2xl font-bold -mt-[8px] tracking-tight dark:text-gray-200`}
            >
              CITRUS CLEAN
            </h1>
          </>
        </Link>
        <div className="flex items-center gap-6">
          <Link
            href="/dashboard"
            className="dark:text-gray-300 dark:hover:text-white transition"
          >
            <User size={24} />
          </Link>
          <Link
            href="/bag"
            className="relative dark:text-gray-300 dark:hover:text-white transition"
          >
            <ShoppingBag size={24} />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                {totalItems}
              </span>
            )}
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}

export default Header
