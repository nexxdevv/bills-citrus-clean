"use client";

import Link from "next/link";
import React from "react";
import { Pacifico, Chicle } from "next/font/google";
import { ShoppingBag, User } from "lucide-react";
import { useCart } from "@/context/CartContext";
import ThemeToggle from "./ThemeToggle";

const pacifico = Pacifico({ subsets: ["latin"], weight: "400" });
const chicle = Chicle({ subsets: ["latin"], weight: "400" });

const Header = () => {
  const { cart } = useCart();

  // Calculate total item count in the cart
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <header className="shadow-sm border-b border-gray-300/50 dark:border-neutral-900/50">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-4">
        <Link href="/" className="leading-none">
          <>
            <h1 className={`${pacifico.className}  text-2xl tracking-wide dark:text-white`}>
              Bill&apos;s
            </h1>
            <h1 className={`${chicle.className}  text-3xl -mt-2 tracking-tight dark:text-gray-200`}>
              CITRUS CLEAN
            </h1>
          </>
        </Link>
        <div className="flex items-center gap-6">
          <Link
            href="/dashboard"
            className="dark:text-gray-300   dark:hover:text-white transition"
          >
            <User size={24} />
          </Link>
          <Link
            href="/bag"
            className="relative  dark:text-gray-300  dark:hover:text-white transition"
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
  );
};

export default Header;
