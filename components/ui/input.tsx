import React from "react"

interface InputProps {
  type: string
  placeholder: string
  value: string
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  className: string
}

const Input = ({
  type,
  placeholder,
  value,
  onChange,
  className
}: InputProps) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 ${className}`}
    />
  )
}

export { Input }
