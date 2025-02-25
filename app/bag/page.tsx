"use client"

import { useCart } from "@/context/CartContext"
import Image from "next/image"
import Link from "next/link"
import { Plus, Minus, Trash } from "lucide-react"
import { useAuth } from "@/context/AuthContext"

const BagPage = () => {
  const { cart, addItem, decreaseQuantity, removeItem, clearCart } = useCart()
  const { user } = useAuth()

  const totalPrice = cart.reduce(
    (total, item) => total + (item.price || 0) * item.quantity,
    0
  )

  const handleBuyNow = async () => {
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cart, userId: user?.uid, email: user?.email })
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

  return (
    <div className="max-w-4xl mx-auto py-5   text-gray-900 dark:text-white">
      <h2 className="text-3xl font-bold mb-6 text-brandGreen dark:text-white px-5">
        Bag
      </h2>

      {cart.length === 0 ? (
        <p className="text-center text-gray-500">Your bag is empty.</p>
      ) : (
        <>
          <div className="divide-y overflow-hidden">
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between py-4 px-6  bg-lightMode dark:bg-darkLight "
              >
                {/* Product Image */}
                <Image
                  src={item.image || "/placeholder.jpg"} // Use placeholder if no image
                  alt={item?.name || "Product"}
                  width={60}
                  height={60}
                  className="rounded-xl object-contain aspect-square bg-white"
                />

                {/* Product Details */}
                <div className="flex-1 flex flex-col gap-1 ml-4">
                  <h3 className="font-semibold  ">{item.name}</h3>
                  <p className="text-xs text-gray-600 dark:text-slate-400 ">
                    {item.weight}
                  </p>
                  <p className="font-semibold  ">${item.price}</p>
                </div>

                {/* Quantity Controls */}
                <div className="flex  justify-center items-center gap-2 flex-col-reverse ml-2">
                  {/* Change the decrement button to a trash button if quantity is 1 */}
                  <button
                    onClick={() =>
                      item.quantity === 1
                        ? removeItem(item.id)
                        : decreaseQuantity(item.id)
                    }
                    className="p-2  bg-gray-200   rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                  >
                    {item.quantity === 1 ? (
                      <Trash size={18} className="text-red-500" />
                    ) : (
                      <Minus size={18} className="text-gray-700" />
                    )}
                  </button>
                  <span className="w-8 text-xl text-center font-medium text-gray-700 dark:text-slate-300">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => addItem(item)}
                    className="p-2 bg-gray-200 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                  >
                    <Plus size={18} className="text-gray-700" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Total & Actions */}
          <div className="mt-5 text-center space-y-5 px-5">
            <div className="w-full flex justify-between ">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Total
              </h3>
              <p className="text-xl font-semibold text-gray-900 dark:text-white">
                ${totalPrice}
              </p>
            </div>
            <div className="flex justify-center gap-4">
              <button
                onClick={clearCart}
                className="flex-1 text-gray-900 bg-gray-200 font-medium h-[65px] flex items-center justify-center hover:bg-gray-300 transition rounded-xl py-2 shadow-md"
              >
                Empty Bag
              </button>
              <Link
                href="/checkout"
                onClick={handleBuyNow}
                className="flex-1 bg-orange-500 text-white font-medium flex items-center justify-center hover:bg-orange-400 transition rounded-xl py-2 hover:inner-shadow-md hover:shadow-orange-500/50"
              >
                Checkout
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default BagPage
