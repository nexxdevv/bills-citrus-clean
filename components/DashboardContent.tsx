"use client"

import { useAuth } from "@/context/AuthContext"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { db } from "@/lib/firebase"
import { doc, getDoc } from "firebase/firestore"
import Image from "next/image"

interface Order {
  id: string
  product_image: string
  product_name: string
  date: string
  quantity: number
  total: number
}

export default function DashboardContent() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  useEffect(() => {
    if (!user) {
      router.push("/auth")
      return
    }

    const fetchOrders = async () => {
      const userRef = doc(db, "users", user.uid)
      const userSnap = await getDoc(userRef)

      if (userSnap.exists()) {
        setOrders(userSnap.data().orders || [])
      }
    }

    fetchOrders()
  }, [user, router])

  if (!user) {
    return null // Prevent rendering before redirect
  }

  return (
    <div className="flex flex-col min-h-screen p-6 text-white">
      <h2 className="text-3xl font-bold mb-6 ">Dashboard</h2>

      {/* User Info Section */}
      <div className="flex flex-col  mb-8">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 flex items-center justify-center border border-gray-400 rounded-full bg-gray-200 text-xl font-semibold text-gray-700">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <p className="mt-2 text-xl font-medium  text-white">{user.name}</p>
        </div>
      </div>

      <h2 className="text-2xl font-semibold  mb-4 text-white">Your Orders</h2>

      {/* Orders List */}
      <div className="w-full max-w-md space-y-4">
        {orders.length === 0 ? (
          <p className="text-gray-600">You have no recent orders.</p>
        ) : (
          orders.map((order) => (
            <div
              key={order.id}
              className="flex items-start bg-white rounded-xl shadow-sm p-4 w-full"
            >
              {/* Product Image */}
              <Image
                src={order.product_image}
                alt={order.product_name}
                width={60}
                height={60}
                className="rounded-xl object-cover"
              />

              {/* Order Details */}
              <div className="flex-1 flex flex-col gap-3 ml-4">
                <p className="text-xl font-semibold text-gray-900">
                  {order.product_name}
                </p>
                <p className="text-sm text-gray-700">Qty: {order.quantity}</p>
                <p className="text-xl font-semibold text-gray-900">
                  ${order.total}
                </p>
              </div>
              <div className="flex flex-col justify-between gap-3">
                <p className="text-sm text-gray-600 text-right">{order.date}</p>
                <p className="text-sm  text-white">spacer</p>
              </div>
            </div>
          ))
        )}
      </div>

      <button
        onClick={logout}
        className="mt-6 px-6 py-2 bg-gray-800 text-white rounded-xl hover:bg-gray-700 transition"
      >
        Logout
      </button>
    </div>
  )
}
