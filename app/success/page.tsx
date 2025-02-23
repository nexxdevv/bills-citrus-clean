"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"

export default function SuccessPage() {
  const searchParams = useSearchParams()
  const session_id = searchParams.get("session_id")
  const [orderSaved, setOrderSaved] = useState(false)

  useEffect(() => {
    if (!session_id) return

    const saveOrder = async () => {
      try {
        console.log("Saving order...") // Debugging log
        const res = await fetch(`/api/save-order?session_id=${session_id}`)
        if (res.ok) {
          setOrderSaved(true)
          console.log("Order saved successfully.")
        } else {
          console.error("Failed to save order:", res.status)
        }
      } catch (error) {
        console.error("Failed to save order:", error)
      }
    }

    saveOrder()
  }, [session_id]) // Removed `orderSaved` from dependencies

  return (
    <div>
      <h1>Thank you for your order!</h1>
      <p>Your order has been successfully placed.</p>
    </div>
  )
}
