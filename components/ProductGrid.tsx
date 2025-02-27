"use client"

import { useState, useEffect } from "react"
import { db } from "@/lib/firebase"
import { collection, getDocs, query, limit } from "firebase/firestore"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useCart } from "@/context/CartContext"
import { useAuth } from "@/context/AuthContext"
import { ShoppingBag } from "lucide-react"
import { BiDollar } from "react-icons/bi"

type Product = {
  id: string
  name: string
  image: string
  weight: string
  price: number
  description: string
  quantity: number
}

const PRODUCTS_LIMIT = 2 // Define limit as a constant

export default function ProductGrid() {
  const { addItem } = useCart()
  const { user } = useAuth()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      setError(null)

      try {
        const q = query(collection(db, "products"), limit(PRODUCTS_LIMIT))
        const querySnapshot = await getDocs(q)
        const productsData = querySnapshot.docs.map(
          (doc) => ({ id: doc.id, ...doc.data() } as Product)
        )
        setProducts(productsData)
      } catch (err) {
        console.error("Error fetching products:", err)
        setError("Failed to load products.")
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const handleBuyNow = async (product: Product) => {
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product, userId: user?.uid, email: user?.email })
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(
          errorData?.message || `HTTP error! status: ${res.status}`
        )
      }

      const { url } = await res.json()
      if (url) {
        window.location.href = url
      }
    } catch (error) {
      console.error("Checkout error:", error)
      alert("An error occurred during checkout. Please try again later.")
    }
  }

  if (loading) {
    return <div>Loading products...</div>
  }

  if (error) {
    return <div>{error}</div>
  }

  return (
    <div className="max-w-5xl-lg mx-auto px-5 py-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-12">
        {products.map((product) => (
          <Card
            key={product.id}
            className="shadow-lg rounded-2xl  bg-lightMode dark:bg-darkLight  z-10 pb-4 relative"
          >
            <div className="w-full bg-white rounded-t-2xl shadow-sm">
              <Image
                src={product.image}
                alt={product.name}
                height={300}
                width={300}
                className="rounded-t-xl h-[360px] aspect-square object-contain w-full"
                priority
              />
            </div>
            <CardContent className="pt-4 px-5 flex flex-col gap-1 items-center">
              <div className="flex flex-col items-center gap-1">
                <h2 className="text-xl font-semibold dark:text-white">
                  {product.name}
                </h2>
                <p className=" text-gray-500 dark:text-gray-400 text-sm">
                  {product.weight}
                </p>
              </div>
              <p className="text-xl font-semibold dark:text-white mt-2">
                ${product.price}
              </p>
            </CardContent>
            {/* Button Group: Clipped Onto the Bottom of the Card */}
            <div className="flex gap-5 px-5 mt-5">
              <Button
                onClick={() => addItem(product)}
                className="flex-1 items-center text-md text-black font-medium hover:bg-gray-50 transition rounded-b-xl  shadow-md bg-[#F0F0F4] h-[65px] flex justify-center"
              >
                <ShoppingBag />
              </Button>
              <Button
                onClick={() => handleBuyNow(product)}
                className="flex-1 items-center font-medium bg-orange-500 text-white hover:bg-orange-400 transition text-md rounded-b-xl  shadow-md h-[65px] flex justify-center"
              >
                <BiDollar size={23} />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
