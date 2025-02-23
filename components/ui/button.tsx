import { cn } from "@/lib/utils"
import { ButtonHTMLAttributes } from "react"

export function Button({
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        "px-4 py-2 text-white bg-black rounded-lg hover:opacity-80",
        className
      )}
      {...props}
    />
  )
}
