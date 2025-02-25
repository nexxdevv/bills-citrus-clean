"use client"

import { createContext, useContext, useState, useEffect } from "react"

const CartContext = createContext({
  cart: [] as {
    id: string
    quantity: number
    price?: number
    name?: string
    image?: string
    weight?: string
  }[],
  addItem: (item: { id: string }) => {},
  removeItem: (id: string) => {},
  decreaseQuantity: (id: string) => {},
  clearCart: () => {}
})

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<{ id: string; quantity: number }[]>([])

  // Load cart from local storage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("cart")
    if (savedCart) {
      setCart(JSON.parse(savedCart))
    }
  }, [])

  // Save cart to local storage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart))
  }, [cart])

  // Add item to cart
  const addItem = (item: { id: string }) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((cartItem) => cartItem.id === item.id)
      if (existingItem) {
        return prevCart.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        )
      }
      return [...prevCart, { ...item, quantity: 1 }]
    })
  }

  // Remove item from cart
  const removeItem = (id: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id))
  }

  // Decrease item quantity
  const decreaseQuantity = (id: string) => {
    setCart((prevCart) =>
      prevCart
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0)
    )
  }

  // Clear cart
  const clearCart = () => {
    setCart([])
  }

  return (
    <CartContext.Provider
      value={{ cart, addItem, removeItem, decreaseQuantity, clearCart }}
    >
      {children}
    </CartContext.Provider>
  )
}

// Hook to use the cart context
export const useCart = () => {
  return useContext(CartContext)
}
