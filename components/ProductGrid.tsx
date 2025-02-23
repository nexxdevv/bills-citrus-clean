"use client"

import { useState, useEffect } from "react"
import { db } from "@/lib/firebase"
import { collection, getDocs, query, limit } from "firebase/firestore"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useCart } from "@/context/CartContext"
import { useAuth } from "@/context/AuthContext"

type Product = {
  id: string
  name: string
  image: string
  weight: string
  price: number
}

export default function ProductGrid() {
  const { addItem } = useCart()
  const { user } = useAuth()
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    const fetchProducts = async () => {
      const q = query(collection(db, "products"), limit(6))
      const querySnapshot = await getDocs(q)
      const productsData = querySnapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as Product)
      )
      setProducts(productsData)
    }
    fetchProducts()
  }, [])

  const handleBuyNow = async (product: Product) => {
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product,
          userId: user?.uid,
          email: user?.email
        })
      })
      const { url } = await res.json()
      if (url) {
        window.location.href = url
      }
    } catch (error) {
      console.error("Checkout error:", error)
    }
  }

  return (
    <div className="max-w-screen-lg mx-auto px-6 pb-8 pt-6">
      <h2 className="text-3xl font-bold mb-6 ">Products</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2  gap-8">
        {products.map((product) => (
          <Card
            key={product.id}
            className="shadow-lg rounded-2xl overflow-hidden bg-card "
          >
            <div className="relative w-full">
              <Image
                src={product.image}
                alt={product.name}
                height={400}
                width={400}
                className="rounded-t-xl aspect-square object-contain w-full"
              />
            </div>

            <CardContent className="p-4 flex flex-col gap-1 items-start">
              <h2 className="text-xl font-semibold ">{product.name}</h2>
              <p className="text-sm text-gray-500">{product.weight}</p>
              <p className="text-xl font-semibold ">${product.price}</p>

              <div className="flex justify-between w-full mt-4 gap-2">
                <Button
                  onClick={() => addItem(product)}
                  className="flex-1    hover:bg-gray-300 transition rounded-xl py-2"
                >
                  Add to Bag
                </Button>
                <Button
                  onClick={() => handleBuyNow(product)}
                  className="flex-1 bg-orange-400  text-white hover:bg-gray-800 transition rounded-xl py-2"
                >
                  Buy Now
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
