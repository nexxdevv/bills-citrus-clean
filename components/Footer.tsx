import React from "react"

const Footer = () => {
  return (
    <footer className="border-t">
      <p className="text-center dark:text-slate-50 text-sm p-5  bg-lightMode dark:bg-darkMode">
        Bill&apos;s Citrus Clean &copy; {new Date().getFullYear()}. Built with
        Next.js by Avalon-9.
      </p>
    </footer>
  )
}

export default Footer
