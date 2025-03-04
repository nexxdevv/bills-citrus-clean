import type { Config } from "tailwindcss"

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: "#B8D8B4",
        darkMode: "#1F1E25",
        darkLight: "#2B2A32",
        lightMode: "#e9edd0",
        brandGreen: "#3c5c44"
      }
    }
  },
  plugins: []
} satisfies Config
