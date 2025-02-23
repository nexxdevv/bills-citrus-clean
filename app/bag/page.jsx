"use client"

import { useCart } from "@/context/CartContext"
import Image from "next/image"
import Link from "next/link"
import { Plus, Minus, Trash } from "lucide-react"

const BagPage = () => {
  const { cart, addItem, decreaseQuantity, removeItem, clearCart } = useCart()

  // Calculate total price
  const totalPrice = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  )

  return (
    <div className="max-w-4xl mx-auto p-6   text-gray-900 dark:text-white">
      <h2 className="text-3xl font-bold mb-6">Bag</h2>

      {cart.length === 0 ? (
        <p className="text-center text-gray-500">Your bag is empty.</p>
      ) : (
        <>
          <div className="space-y-6">
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between py-4 px-6 border-b border-gray-200 dark:border-gray-700 bg-card rounded-xl shadow-sm dark:bg-gray-800"
              >
                {/* Product Image */}
                <Image
                  src={item.image || "/placeholder.jpg"} // Use placeholder if no image
                  alt={item.name}
                  width={60}
                  height={60}
                  className="rounded-xl object-cover"
                />

                {/* Product Details */}
                <div className="flex-1 flex flex-col gap-1 ml-4">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {item.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {item.weight}
                  </p>
                  <p className="text-xl font-semibold text-gray-900 dark:text-white">
                    ${item.price}
                  </p>
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
                    className="p-2  bg-gray-200 dark:bg-gray-700 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                  >
                    {item.quantity === 1 ? (
                      <Trash size={18} className="text-red-500" />
                    ) : (
                      <Minus size={18} />
                    )}
                  </button>
                  <span className="w-8 text-xl text-center font-medium text-gray-700 dark:text-gray-300">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => addItem(item)}
                    className="p-2 bg-gray-200 dark:bg-gray-700 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                  >
                    <Plus size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Total & Actions */}
          <div className="mt-8 text-center space-y-4">
            <div className="w-full flex justify-between ">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Total
              </h3>
              <p className="text-xl font-semibold text-gray-900 dark:text-white">
                ${totalPrice}
              </p>
            </div>
            <div className="flex justify-center gap-2 mt-4">
              <button
                onClick={clearCart}
                className="flex-1 text-gray-900 bg-gray-200 hover:bg-gray-300 transition rounded-xl py-2"
              >
                Clear Bag
              </button>
              <Link
                href="/checkout"
                className="flex-1 bg-black text-white hover:bg-gray-800 transition rounded-xl py-2"
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
