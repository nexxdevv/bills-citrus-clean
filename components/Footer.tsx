import React from 'react'

const Footer = () => {
  return (
    <footer>
        <p className="text-center dark:text-slate-50 text-sm px-5 py-12 bg-lightMode dark:bg-darkMode">
             Bill's Citrus Clean &copy; {new Date().getFullYear()}. Built with Next.js by Avalon-9.
        </p>
    </footer>
  )
}

export default Footer