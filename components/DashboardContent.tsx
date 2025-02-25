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
        setOrders((userSnap.data().orders || []).reverse())
      }
    }

    fetchOrders()
  }, [user, router])

  if (!user) {
    return null // Prevent rendering before redirect
  }

  return (
    <div className="flex flex-col min-h-screen py-5 ">
      <h2 className="text-3xl font-bold mb-5 text-brandGreen px-5 dark:text-slate-50">Dashboard</h2>

      {/* User Info Section */}
      <div className="bg-lightMode dark:bg-darkLight dark:border-slate-800 p-5 border-y gap-5 flex flex-col justify-between">
        <div className="flex flex-col">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 flex items-center justify-center border border-brandGreen rounded-full bg-gray-200 text-xl font-semibold text-gray-700">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex flex-col gap-none">
              <p className="mt-2 text-lg font-medium leading-none dark:text-slate-50">
                {user.name}
              </p>
              <p className="mt-2 text-sm font-medium leading-none dark:text-slate-50">
                {user.email}
              </p>
            </div>
          </div>
        </div>
        <button
          onClick={logout}
          className="w-32 px-6 py-2 bg-red-500 text-white font-medium rounded-xl hover:bg-gray-700 transition"
        >
          Logout
        </button>
      </div>

      <h2 className="text-2xl font-semibold text-brandGreen dark:text-slate-50 mt-5 px-5">
        Your Orders
      </h2>

      {/* Orders List */}
      <div className="w-full max-w-md flex flex-col divide-y dark:divide-slate-800 mt-5">
        {orders.length === 0 ? (
          <p className="text-gray-600">You have no recent orders.</p>
        ) : (
          orders.map((order) => (
            <div
              key={order.id}
              className="flex items-start bg-lightMode dark:bg-darkLight p-4 w-full"
            >
              {/* Product Image */}
              <Image
                src={order.product_image}
                alt={order.product_name}
                width={60}
                height={60}
                className="rounded-full object-contain bg-white aspect-square "
              />

              {/* Order Details */}
              <div className="flex-1 flex flex-col gap-1 ml-2">
                <div className="flex items-center justify-between">
                  <p className=" font-semibold text-gray-900 dark:text-slate-50 leading-none">
                    ({order.quantity}) {order.product_name}
                  </p>
                  <p className="text-sm flex-1 text-gray-600 text-right dark:text-slate-50 leading-none">
                    {order.date}
                  </p>
                </div>
                <p className=" font-medium text-gray-900 dark:text-slate-50">${order.total}</p>
              </div>
              <div className="flex flex-col justify-between gap-3"></div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
