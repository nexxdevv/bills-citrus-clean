import Link from "next/link"
import React from "react"

const Header = () => {
  return (
    <header className="flex justify-between p-4 border-b">
      <Link href="/">Bill's Citrus Clean</Link>
      <div className="flex gap-4">
        <Link href="/dashboard">Dashboard</Link>
        <Link href="/bag">Bag</Link>
      </div>
    </header>
  )
}

export default Header
